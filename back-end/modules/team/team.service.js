const mongoose = require("mongoose");
const { Team } = require("./team.schema");
const { Student } = require("../students/students.schema");
const { Marks } = require("../marks/marks.schema")

const { slugify, toNumber } = require("../../helper/helper")

const populateTeam = (query) =>
    query
        .populate("section")
        .populate("team_members")
        .populate({
            path: "team_members",
            populate: [
                { path: "student_department" },
                { path: "section" },
                { path: "team" },
            ],
        });

// Create team and synchronize students
const createTeam = async (data) => {
    const teamMembers = data.team_members || [];

    // Validate student IDs
    if (teamMembers.length > 0) {
        const validStudents = await Student.find({
            _id: { $in: teamMembers },
        }).select("_id section");

        if (validStudents.length !== new Set(teamMembers.map(String)).size) {
            throw new Error("One or more team members do not exist.");
        }

        // Ensure all students belong to the team's section
        const invalidSectionStudent = validStudents.some(
            (student) => String(student.section) !== String(data.section)
        );

        if (invalidSectionStudent) {
            throw new Error(
                "All team members must belong to the selected section."
            );
        }
    }

    const team = await Team.create(data);

    // Update each student's team reference
    if (teamMembers.length > 0) {
        await Student.updateMany(
            { _id: { $in: teamMembers } },
            { $set: { team: team._id } }
        );
    }

    return populateTeam(Team.findById(team._id));
};

// Get all teams
const getAllTeams = () => populateTeam(Team.find());

const getTeamDetails = async (id, labId = null) => {
    const matchStage = {};

    // Filter by Team ID
    if (id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid team ID");
        }

        matchStage.team = new mongoose.Types.ObjectId(id);
    }

    // Optional: Filter by Lab ID
    if (labId) {
        if (!mongoose.Types.ObjectId.isValid(labId)) {
            throw new Error("Invalid lab ID");
        }

        matchStage.lab = new mongoose.Types.ObjectId(labId);
    }

    const records = await Marks.aggregate([
        // Match by team ID and optionally lab ID
        { $match: matchStage },

        // Get student details
        {
            $lookup: {
                from: "students",
                localField: "student",
                foreignField: "_id",
                as: "student",
            },
        },
        {
            $unwind: {
                path: "$student",
                preserveNullAndEmptyArrays: true,
            },
        },

        // Get team details
        {
            $lookup: {
                from: "teams",
                localField: "team",
                foreignField: "_id",
                as: "team",
            },
        },
        {
            $unwind: {
                path: "$team",
                preserveNullAndEmptyArrays: true,
            },
        },

        // Get lab details
        {
            $lookup: {
                from: "labs",
                localField: "lab",
                foreignField: "_id",
                as: "lab",
            },
        },
        {
            $unwind: {
                path: "$lab",
                preserveNullAndEmptyArrays: true,
            },
        },

        // Get section details
        {
            $lookup: {
                from: "sections",
                localField: "team.section",
                foreignField: "_id",
                as: "section",
            },
        },
        {
            $unwind: {
                path: "$section",
                preserveNullAndEmptyArrays: true,
            },
        },

        // Get department details
        {
            $lookup: {
                from: "departments",
                localField: "student.student_department",
                foreignField: "_id",
                as: "department",
            },
        },
        {
            $unwind: {
                path: "$department",
                preserveNullAndEmptyArrays: true,
            },
        },

        // Select required fields
        {
            $project: {
                _id: 1,

                student: {
                    _id: "$student._id",
                    name: "$student.student_name",
                    reg_no: "$student.student_reg",
                },

                team: {
                    _id: "$team._id",
                    name: "$team.team_name",
                    number: "$team.team_number",
                    members: "$team.team_members",
                    project: "$team.project",
                },

                section: {
                    name: "$section.section_name",
                    department_name: "$department.department_name",
                },

                lab: {
                    _id: "$lab._id",
                    name: "$lab.lab_name",
                    maximum_mark: "$lab.maximum_mark",
                },

                evaluation: 1,
                total_marks: 1,
                maximum_marks: 1,
                project_status: 1,
                createdAt: 1,
            },
        },
    ]);

    // Group marks by team and lab
    const groupedTeams = new Map();

    for (const record of records) {
        const teamId = record.team?._id?.toString();
        const labKey = record.lab?._id?.toString() ?? "no-lab";

        if (!teamId) continue;

        const groupKey = `${teamId}-${labKey}`;

        if (!groupedTeams.has(groupKey)) {
            groupedTeams.set(groupKey, {
                team: record.team,
                section: record.section,
                lab: record.lab,
                members: [],
                seenStudents: new Set(),
            });
        }

        const group = groupedTeams.get(groupKey);

        const studentId = record.student?._id?.toString();

        // Skip records without a student ID
        if (!studentId) continue;

        // Avoid duplicate mark records for the same student and lab
        if (group.seenStudents.has(studentId)) continue;

        group.seenStudents.add(studentId);
        group.members.push(record);
    }

    const results = [];

    for (const group of groupedTeams.values()) {
        const members = group.members.map((record) => {
            const evaluation = record.evaluation ?? {};

            // Evaluation categories
            const internal = toNumber(
                evaluation.practical_execution
            );

            const labRecord = toNumber(
                evaluation.documendation
            );

            const viva = toNumber(
                evaluation.viva
            );

            const project =
                toNumber(evaluation.used_html) +
                toNumber(evaluation.js_logics) +
                toNumber(evaluation.css_responsiveness);

            const total = toNumber(record.total_marks);

            return {
                name: record.student?.name ?? "Unknown Student",
                reg_no: record.student?.reg_no ?? "",

                marks: {
                    internal: String(internal),
                    lab_record: String(labRecord),
                    viva: String(viva),
                    project: String(project),
                    total: String(total),
                },

                numericMarks: {
                    internal,
                    lab_record: labRecord,
                    viva,
                    project,
                    total,
                },
            };
        });

        const evaluatedMembers = members.length;

        // Calculate average for a mark category
        const average = (key) =>
            evaluatedMembers
                ? members.reduce(
                    (sum, member) =>
                        sum + member.numericMarks[key],
                    0
                ) / evaluatedMembers
                : 0;

        // Find the top scorer
        const topScorer = [...members].sort(
            (a, b) =>
                b.numericMarks.total - a.numericMarks.total
        )[0];

        // Build team members object
        const teamMembers = {};

        for (const member of members) {
            const memberKey = slugify(member.name);

            teamMembers[memberKey] = {
                reg_no: member.reg_no,
                marks: member.marks,
            };
        }

        results.push({
            team_id: group.team?._id?.toString() ?? "",

            team_name:
                group.team?.name ?? "Unnamed Team",

            team_avg: average("total").toFixed(2),

            // Assigned after sorting
            team_rank: "0",

            members_evaluuvated: String(evaluatedMembers),

            team_no: group.team?.number ?? "",

            top_scorer: {
                name: topScorer?.name ?? "",
                score: String(
                    topScorer?.numericMarks.total ?? 0
                ),
            },

            section: {
                department_name:
                    group.section?.department_name ?? "",

                section_name:
                    group.section?.name ?? "",
            },

            lab: {
                lab_id: group.lab?._id?.toString() ?? "",
                lab_name: group.lab?.name ?? "",
                maximum_mark: String(
                    toNumber(group.lab?.maximum_mark)
                ),
            },

            project: {
                title: group.team?.project?.title ?? "",

                project_status:
                    group.team?.project?.project_status ??
                    "NOT_SUBMITTED",

                project_link: "",

                github_link:
                    group.team?.project?.github_url ?? "",
            },

            team_perfomence: {
                internal: average("internal").toFixed(2),
                lab_record: average("lab_record").toFixed(2),
                viva: average("viva").toFixed(2),
                project: average("project").toFixed(2),
            },

            team_members: teamMembers,
        });
    }

    // Sort teams by average marks, highest first
    results.sort(
        (a, b) =>
            Number(b.team_avg) - Number(a.team_avg)
    );

    // Assign ranks
    results.forEach((team, index) => {
        team.team_rank = String(index + 1);
    });

    return results;
};

// Get teams by section
const getTeamsBySection = (sectionId) =>
    populateTeam(Team.find({ section: sectionId }));

// Update team and synchronize student references
const updateTeam = async (id, data) => {
    const existingTeam = await Team.findById(id);

    if (!existingTeam) {
        throw new Error("Team not found.");
    }

    const oldMembers = existingTeam.team_members.map(String);

    // If team_members wasn't sent, retain the current members
    const newMembers =
        data.team_members !== undefined
            ? data.team_members.map(String)
            : oldMembers;

    const updatedSection = data.section || existingTeam.section;

    if (newMembers.length > 0) {
        const validStudents = await Student.find({
            _id: { $in: newMembers },
        }).select("_id section");

        if (validStudents.length !== new Set(newMembers).size) {
            throw new Error("One or more team members do not exist.");
        }

        const invalidSectionStudent = validStudents.some(
            (student) => String(student.section) !== String(updatedSection)
        );

        if (invalidSectionStudent) {
            throw new Error(
                "All team members must belong to the selected section."
            );
        }
    }

    const updatedTeam = await Team.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true,
        }
    );

    // Clear the team field only for students removed from this team
    const removedMembers = oldMembers.filter(
        (studentId) => !newMembers.includes(studentId)
    );

    if (removedMembers.length > 0) {
        await Student.updateMany(
            {
                _id: { $in: removedMembers },
                team: id,
            },
            { $set: { team: null } }
        );
    }

    // Assign this team to the current members
    if (newMembers.length > 0) {
        await Student.updateMany(
            { _id: { $in: newMembers } },
            { $set: { team: updatedTeam._id } }
        );
    }

    return populateTeam(Team.findById(updatedTeam._id));
};

// Delete team and clear student references
const deleteTeam = async (id) => {
    const team = await Team.findById(id);

    if (!team) {
        throw new Error("Team not found.");
    }

    await Student.updateMany(
        { team: team._id },
        { $set: { team: null } }
    );

    return Team.findByIdAndDelete(id);
};

module.exports = {
    createTeam,
    getAllTeams,
    getTeamDetails,
    getTeamsBySection,
    updateTeam,
    deleteTeam,
};
const { Marks } = require("../marks/marks.schema")
// Convert values stored as strings into numbers.
const toNumber = (value) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
};

const slugify = (value = "") =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

const getTeamLeaderboardService = async ({ labId } = {}) => {
    const matchStage = {};

    // Optional filter: show results for one lab only.
    if (labId) {
        matchStage.lab = labId;
    }

    const records = await Marks.aggregate([
        { $match: matchStage },

        {
            $lookup: {
                from: "students",
                localField: "student",
                foreignField: "_id",
                as: "student",
            },
        },
        { $unwind: "$student" },

        {
            $lookup: {
                from: "teams",
                localField: "team",
                foreignField: "_id",
                as: "team",
            },
        },
        { $unwind: "$team" },

        {
            $lookup: {
                from: "labs",
                localField: "lab",
                foreignField: "_id",
                as: "lab",
            },
        },
        { $unwind: { path: "$lab", preserveNullAndEmptyArrays: true } },

        {
            $lookup: {
                from: "sections",
                localField: "team.section",
                foreignField: "_id",
                as: "section",
            },
        },
        { $unwind: { path: "$section", preserveNullAndEmptyArrays: true } },

        {
            $lookup: {
                from: "departments",
                localField: "student.student_department",
                foreignField: "_id",
                as: "department",
            },
        },
        { $unwind: { path: "$department", preserveNullAndEmptyArrays: true } },

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

    // Group marks by team and lab, so marks from different labs
    // don't accidentally get combined into one leaderboard entry.
    const groupedTeams = new Map();

    for (const record of records) {
        const teamId = record.team?._id?.toString();
        const labKey = record.lab?._id?.toString() ?? "no-lab";
        const groupKey = `${teamId}-${labKey}`;

        if (!teamId) continue;

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

        // Only include one mark record per student in a team/lab.
        if (group.seenStudents.has(studentId)) continue;

        group.seenStudents.add(studentId);
        group.members.push(record);
    }

    const results = [];

    for (const group of groupedTeams.values()) {
        const members = group.members.map((record) => {
            const evaluation = record.evaluation ?? {};

            /*
             * IMPORTANT: Update this mapping to match your marking scheme.
             *
             * Example mapping:
             * internal   = practical_execution
             * lab_record = documendation
             * viva       = viva
             * project    = used_html + js_logics + css_responsiveness
             *
             * These are illustrative mappings, not verified category definitions.
             */
            const internal = toNumber(evaluation.practical_execution);
            const labRecord = toNumber(evaluation.documendation);
            const viva = toNumber(evaluation.viva);

            const project =
                toNumber(evaluation.used_html) +
                toNumber(evaluation.js_logics) +
                toNumber(evaluation.css_responsiveness);

            return {
                name: record.student.name ?? "Unknown Student",
                reg_no: record.student.reg_no ?? "",
                marks: {
                    internal: String(internal),
                    lab_record: String(labRecord),
                    viva: String(viva),
                    project: String(project),
                    total: String(toNumber(record.total_marks)),
                },
                numericMarks: {
                    internal,
                    lab_record: labRecord,
                    viva,
                    project,
                    total: toNumber(record.total_marks),
                },
            };
        });

        const evaluatedMembers = members.length;

        const average = (key) =>
            evaluatedMembers
                ? members.reduce(
                    (sum, member) => sum + member.numericMarks[key],
                    0
                ) / evaluatedMembers
                : 0;

        const topScorer = [...members].sort(
            (a, b) => b.numericMarks.total - a.numericMarks.total
        )[0];

        const teamMembers = {};

        for (const member of members) {
            teamMembers[slugify(member.name)] = {
                reg_no: member.reg_no,
                marks: member.marks,
            };
        }

        results.push({
            team_name: group.team.name ?? "Unnamed Team",
            team_avg: average("total").toFixed(2),
            team_rank: "0", // Assigned after all teams are sorted.
            members_evaluvated: String(evaluatedMembers),
            team_no: group.team.number ?? "",
            top_scorer: {
                name: topScorer?.name ?? "",
                score: String(topScorer?.numericMarks.total ?? 0),
            },
            section: {
                department_name: group.section?.department_name ?? "",
                section_name: group.section?.name ?? "",
            },
            project: {
                title: group.team.project?.title ?? "",
                project_status:
                    group.team.project?.project_status ?? "NOT_SUBMITTED",
                project_link: "",
                github_link: group.team.project?.github_url ?? "",
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

    // Highest team average receives rank 1.
    results.sort(
        (a, b) => Number(b.team_avg) - Number(a.team_avg)
    );

    results.forEach((team, index) => {
        team.team_rank = String(index + 1);
    });

    return results;
};

module.exports = {
    getTeamLeaderboardService
}
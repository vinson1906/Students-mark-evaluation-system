const mongoose = require("mongoose");
const { Team } = require("./team.schema");
const { Student } = require("../students/students.schema");

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

// Get team by ID
const getTeamById = (id) => populateTeam(Team.findById(id));

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
    getTeamById,
    getTeamsBySection,
    updateTeam,
    deleteTeam,
};
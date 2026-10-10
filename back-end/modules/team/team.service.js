const { Team } = require("./team.schema");

const populateTeam = (query) =>
    query.populate("section").populate("team_members");

const createTeam = (data) => Team.create(data);

const getAllTeams = () => populateTeam(Team.find());

const getTeamById = (id) => populateTeam(Team.findById(id));

const getTeamsBySection = (sectionId) =>
    populateTeam(Team.find({ section: sectionId }));

const updateTeam = (id, data) =>
    populateTeam(
        Team.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        })
    );

const deleteTeam = (id) => Team.findByIdAndDelete(id);

module.exports = {
    createTeam,
    getAllTeams,
    getTeamById,
    getTeamsBySection,
    updateTeam,
    deleteTeam
};
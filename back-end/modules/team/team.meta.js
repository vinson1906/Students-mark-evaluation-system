const { Team } = require("./team.schema");

const getTeamMeta = async (req, res) => {
    try {
        const teams = await Team.find()
            .select("_id team_name section team_members")
            .lean();

        return res.status(200).json({
            success: true,
            data: teams
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch team metadata",
            error: error.message
        });
    }
};

module.exports = { getTeamMeta };
const { getTopStudentsService, getTopTeamsService } = require("./leaderboard.service")

const getTopTeamLeaderboard = async (req, res) => {
    try {
        const { labId } = req.query;

        const data = await getTopTeamsService({ labId });

        return res.status(200).json({
            success: true,
            count: data.length,
            data,
        });
    } catch (error) {
        console.error("Team leaderboard error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch team leaderboard",
            error: error.message,
        });
    }
};

const getTopStudents = async (req, res) => {
    try {
        const { labId } = req.query;

        const data = await getTopStudentsService({ labId });

        return res.status(200).json({
            success: true,
            count: data.length,
            data,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to fetch top students",
        });
    }
};




module.exports = {
    getTopTeamLeaderboard,
    getTopStudents
}
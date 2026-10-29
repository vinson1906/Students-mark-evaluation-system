const { getTeamLeaderboardService } = require("./leaderboard.service")

const getTeamLeaderboard = async (req, res) => {
    try {
        const { labId } = req.query;

        const data = await getTeamLeaderboardService({ labId });

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

module.exports = {
    getTeamLeaderboard
}
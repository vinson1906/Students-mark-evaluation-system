const express = require("express");
const { getTopTeamLeaderboard, getTopStudents } = require("./leaderboard.controller");

const LeaderBoardRouter = express.Router();

LeaderBoardRouter.get("/get-team-leaderboard", getTopTeamLeaderboard);
LeaderBoardRouter.get("/get-student-leaderboard", getTopStudents)

module.exports = LeaderBoardRouter
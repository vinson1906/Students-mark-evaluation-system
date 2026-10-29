import express from "express";
import { getTeamLeaderboard } from "../controllers/teamLeaderboardController.js";

const router = express.Router();

router.get("/get-team-leaderboard", getTeamLeaderboard);

export default router;
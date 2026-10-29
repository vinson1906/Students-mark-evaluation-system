const express = require("express");
const TeamRouter = express.Router();
const controller = require("./team.controller");
const { authenticateUser } = require("../../middleware/authendication");
const { getTeamMeta } = require("./team.meta")

TeamRouter.post("/create", authenticateUser, controller.createTeam);
TeamRouter.get("/get", authenticateUser, controller.getAllTeams);
TeamRouter.get("/get-meta", getTeamMeta);
TeamRouter.get("/get/section/:sectionId", authenticateUser, controller.getTeamsBySection);
TeamRouter.get("/get/:id", authenticateUser, controller.getTeamById);
TeamRouter.put("/update/:id", authenticateUser, controller.updateTeam);
TeamRouter.delete("/delete/:id", authenticateUser, controller.deleteTeam);

module.exports = TeamRouter; 
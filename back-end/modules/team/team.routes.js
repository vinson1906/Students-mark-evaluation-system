const express = require("express");
const TeamRouter = express.Router();
const controller = require("./team.controller");

TeamRouter.post("/create", controller.createTeam);
TeamRouter.get("/get", controller.getAllTeams);
TeamRouter.get("/get/section/:sectionId", controller.getTeamsBySection);
TeamRouter.get("/get/:id", controller.getTeamById);
TeamRouter.put("/update/:id", controller.updateTeam);
TeamRouter.delete("/delete/:id", controller.deleteTeam);

module.exports = TeamRouter; 
const express = require("express");
const MarkRouter = express.Router();
const controller = require("./marks.controller");
const {authenticateUser} = require("../../middleware/authendication")

MarkRouter.post("/create",authenticateUser, controller.createMarks);
MarkRouter.get("/get",authenticateUser, controller.getAllMarks);
MarkRouter.get("/get/student/:studentId",authenticateUser, controller.getMarksByStudent);
MarkRouter.get("/get/team/:teamId",authenticateUser, controller.getMarksByTeam);
MarkRouter.get("/get/lab/:labId",authenticateUser, controller.getMarksByLab);
MarkRouter.get("/get/:id",authenticateUser, controller.getMarksById);
MarkRouter.put("/update/:id",authenticateUser, controller.updateMarks);
MarkRouter.delete("/delete/:id",authenticateUser, controller.deleteMarks);

module.exports = MarkRouter;
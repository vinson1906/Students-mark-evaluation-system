const express = require("express");
const MarkRouter = express.Router();
const controller = require("./marks.controller");

MarkRouter.post("/create", controller.createMarks);
MarkRouter.get("/get", controller.getAllMarks);
MarkRouter.get("/get/student/:studentId", controller.getMarksByStudent);
MarkRouter.get("/get/team/:teamId", controller.getMarksByTeam);
MarkRouter.get("/get/lab/:labId", controller.getMarksByLab);
MarkRouter.get("/get/:id", controller.getMarksById);
MarkRouter.put("/update/:id", controller.updateMarks);
MarkRouter.delete("/delete/:id", controller.deleteMarks);

module.exports = MarkRouter;
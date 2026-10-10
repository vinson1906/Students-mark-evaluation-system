const express = require("express");
const SectionRouter = express.Router();
const controller = require("./section.controller");

SectionRouter.post("/create", controller.createSection);
SectionRouter.get("/get", controller.getAllSections);
SectionRouter.get("/get/department/:departmentId", controller.getSectionsByDepartment);
SectionRouter.get("/get/:id", controller.getSectionById);
SectionRouter.patch("/update/:id", controller.updateSection);
SectionRouter.delete("/delete/:id", controller.deleteSection);

module.exports = SectionRouter;
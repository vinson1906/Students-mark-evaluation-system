const express = require("express");
const SectionRouter = express.Router();
const controller = require("./section.controller");
const { authenticateUser } = require("../../middleware/authendication");

SectionRouter.post("/create", authenticateUser, controller.createSection);
SectionRouter.get("/get",authenticateUser, controller.getAllSections);
SectionRouter.get("/get/department/:departmentId",authenticateUser, controller.getSectionsByDepartment);
SectionRouter.get("/get/:id", authenticateUser, controller.getSectionById);
SectionRouter.put("/update/:id",authenticateUser, controller.updateSection);
SectionRouter.delete("/delete/:id",authenticateUser, controller.deleteSection);

module.exports = SectionRouter;
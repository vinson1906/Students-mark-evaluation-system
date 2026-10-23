const express = require("express");
const facultyRouter = express.Router();
const { authenticateUser } = require("../../middleware/authendication");

const facultyController = require("./faculty.controller");

facultyRouter.post("/create", authenticateUser, facultyController.createFaculty);

facultyRouter.get("/get", authenticateUser, facultyController.getAllFaculty);

facultyRouter.get(
  "/get/department/:departmentId",
  authenticateUser,
  facultyController.getFacultyByDepartment
);

facultyRouter.get("/get/:id", authenticateUser, facultyController.getFacultyById);

facultyRouter.put("/update/:id", authenticateUser, facultyController.updateFaculty);

facultyRouter.delete("/delete/:id", authenticateUser, facultyController.deleteFaculty);

module.exports = facultyRouter;
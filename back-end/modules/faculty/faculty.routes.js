const express = require("express");
const facultyRouter = express.Router();

const facultyController = require("./faculty.controller");

facultyRouter.post("/faculty/create", facultyController.createFaculty);

facultyRouter.get("/faculty/get", facultyController.getAllFaculty);

facultyRouter.get(
  "/faculty/get/department/:departmentId",
  facultyController.getFacultyByDepartment
);

facultyRouter.get("/faculty/get/:id", facultyController.getFacultyById);

facultyRouter.patch("/faculty/update/:id", facultyController.updateFaculty);

facultyRouter.delete("/faculty/delete/:id", facultyController.deleteFaculty);

module.exports = facultyRouter;
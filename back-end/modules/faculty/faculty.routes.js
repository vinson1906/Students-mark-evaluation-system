const express = require("express");
const facultyRouter = express.Router();

const facultyController = require("./faculty.controller");

facultyRouter.post("/create", facultyController.createFaculty);

facultyRouter.get("/get", facultyController.getAllFaculty);

facultyRouter.get(
  "/get/department/:departmentId",
  facultyController.getFacultyByDepartment
);

facultyRouter.get("/get/:id", facultyController.getFacultyById);

facultyRouter.put("/update/:id", facultyController.updateFaculty);

facultyRouter.delete("/delete/:id", facultyController.deleteFaculty);

module.exports = facultyRouter;
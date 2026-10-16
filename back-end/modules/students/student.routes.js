const express = require("express");
const StudentRouter = express.Router();
const controller = require("./student.controller");
const { Student } = require("./students.schema");

StudentRouter.post("/create", controller.createStudent);
StudentRouter.get("/get", controller.getAllStudents);
StudentRouter.get("/get/section/:sectionId", controller.getStudentsBySection);
StudentRouter.get("/get/:id", controller.getStudentById);
StudentRouter.get("/get/department/:departmentId", controller.getStudentBydepartment)
StudentRouter.put("/update/:id", controller.updateStudent);
StudentRouter.delete("/delete/:id", controller.deleteStudent);
StudentRouter.get("/bulk", controller.BulkUploadController)

module.exports = StudentRouter;
const express = require("express");
const StudentRouter = express.Router();
const controller = require("./student.controller");

const { authenticateUser } = require("../../middleware/authendication");

StudentRouter.post("/create", authenticateUser, controller.createStudent);
StudentRouter.get("/get", authenticateUser, controller.getAllStudents);
StudentRouter.get("/get/section/:sectionId",authenticateUser, controller.getStudentsBySection);
StudentRouter.get("/get/:id", authenticateUser, controller.getStudentById);
StudentRouter.get("/get/department/:departmentId", controller.getStudentBydepartment);
StudentRouter.put("/update/:id", authenticateUser, controller.updateStudent);
StudentRouter.delete("/delete/:id", authenticateUser, controller.deleteStudent);
StudentRouter.get("/bulk", authenticateUser, controller.BulkUploadController)

module.exports = StudentRouter;
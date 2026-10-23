const express = require("express");
const DepartmentRouter = express.Router();
const { authenticateUser } = require("../../middleware/authendication");
const departmentController = require("./department.controller");

DepartmentRouter.post("/department/create", authenticateUser, departmentController.createDepartment);
DepartmentRouter.get("/department/get", authenticateUser, departmentController.getAllDepartments);
DepartmentRouter.get("/department/get/:id", authenticateUser, departmentController.getDepartmentById);
DepartmentRouter.put("/department/update/:id", authenticateUser, departmentController.updateDepartment);
DepartmentRouter.delete("/department/delete/:id", authenticateUser, departmentController.deleteDepartment);

module.exports = DepartmentRouter;
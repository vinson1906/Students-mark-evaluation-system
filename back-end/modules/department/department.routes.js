const express = require("express");
const DepartmentRouter = express.Router();

const departmentController = require("./department.controller");

DepartmentRouter.post("/department/create", departmentController.createDepartment);
DepartmentRouter.get("/department/get", departmentController.getAllDepartments);
DepartmentRouter.get("/department/get/:id", departmentController.getDepartmentById);
DepartmentRouter.put("/department/update/:id", departmentController.updateDepartment);
DepartmentRouter.delete("/department/delete/:id", departmentController.deleteDepartment);

module.exports = DepartmentRouter;
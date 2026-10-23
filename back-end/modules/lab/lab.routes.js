const express = require("express");
const LabRouter = express.Router();

const labController = require("./lab.controller");
const { authenticateUser } = require("../../middleware/authendication");

LabRouter.post("/create",authenticateUser, labController.createLab);
LabRouter.get("/get",authenticateUser, labController.getAllLabs);
LabRouter.get(
    "/get/department/:departmentId",
    authenticateUser,
    labController.getLabsByDepartment
);
LabRouter.get("/get/:id",authenticateUser, labController.getLabById);
LabRouter.put("/update/:id", authenticateUser, labController.updateLab);
LabRouter.delete("/delete/:id", authenticateUser, labController.deleteLab);

module.exports = LabRouter;
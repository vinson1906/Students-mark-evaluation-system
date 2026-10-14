const express = require("express");
const LabRouter = express.Router();

const labController = require("./lab.controller");

LabRouter.post("/create", labController.createLab);
LabRouter.get("/get", labController.getAllLabs);
LabRouter.get(
    "/get/department/:departmentId",
    labController.getLabsByDepartment
);
LabRouter.get("/get/:id", labController.getLabById);
LabRouter.put("/update/:id", labController.updateLab);
LabRouter.delete("/delete/:id", labController.deleteLab);

module.exports = LabRouter;
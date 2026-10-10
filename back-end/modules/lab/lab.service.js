const { Lab } = require("../models/Lab");

const createLab = (data) => Lab.create(data);

const getAllLabs = () =>
    Lab.find().populate("department");

const getLabById = (id) =>
    Lab.findById(id).populate("department");

const getLabsByDepartment = (departmentId) =>
    Lab.find({ department: departmentId }).populate("department");

const updateLab = (id, data) =>
    Lab.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    }).populate("department");

const deleteLab = (id) =>
    Lab.findByIdAndDelete(id);

module.exports = {
    createLab,
    getAllLabs,
    getLabById,
    getLabsByDepartment,
    updateLab,
    deleteLab
};
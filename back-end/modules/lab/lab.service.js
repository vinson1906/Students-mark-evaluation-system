const { Lab } = require("./lab.schema");

const createLab = (data) => {
    console.log(data);

    const res = Lab.create(data)
    return res
};

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
const { Department } = require("./department.schema");
const { Section } = require("../section/section.schema");

const createDepartment = async (data) => {
    return await Department.create({
        department_name: data.department_name,
        section: data.section || [],
    });
};

const getAllDepartments = async () => {
    return await Department.find()
        .populate("section");
};

const getDepartmentById = async (id) => {
    return await Department.findById(id)
        .populate("section");
};

const updateDepartment = async (id, data) => {
    return await Department.findByIdAndUpdate(
        id,
        {
            $set: {
                ...(data.department_name !== undefined && {
                    department_name: data.department_name,
                }),
                ...(data.section !== undefined && {
                    section: data.section,
                }),
            },
        },
        {
            new: true,
            runValidators: true,
        }
    ).populate("section");
};

const deleteDepartment = async (id) => {
    return await Department.findByIdAndDelete(id);
};

module.exports = {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
};
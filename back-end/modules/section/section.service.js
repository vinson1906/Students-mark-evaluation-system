const { Section } = require("./section.schema");

const createSection = (data) => Section.create(data);

const getAllSections = () =>
    Section.find()
        .populate("department")
        .populate("students");

const getSectionById = (id) =>
    Section.findById(id)
        .populate("department")
        .populate("students");

const getSectionsByDepartment = (departmentId) =>
    Section.find({ department: departmentId })
        .populate("department")
        .populate("students");

const updateSection = (id, data) =>
    Section.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    }).populate("department").populate("students");

const deleteSection = (id) => Section.findByIdAndDelete(id);

module.exports = {
    createSection,
    getAllSections,
    getSectionById,
    getSectionsByDepartment,
    updateSection,
    deleteSection
};
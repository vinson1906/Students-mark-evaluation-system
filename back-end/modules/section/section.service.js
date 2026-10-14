const { Section } = require("./section.schema");
const { Student } = require("../students/students.schema");

const createSection = (data) => Section.create(data);

const getAllSections = async () => {
    const sections = await Section.find()
        .populate("department", "department_name code")
        .lean();

    const sectionsWithStudents = await Promise.all(
        sections.map(async (section) => {
            const students = await Student.find({
                section: section._id,
            }).lean();

            return {
                ...section,
                students,
            };
        })
    );

    return sectionsWithStudents;
};

const getSectionById = async (id) => {
    const section = await Section.findById(id)
        .populate("department", "department_name code")
        .lean();

    if (!section) return null;

    const students = await Student.find({
        section: section._id,
    }).lean();

    return {
        ...section,
        students,
    };
};

const getSectionsByDepartment = async (departmentId) => {
    const sections = await Section.find({
        department: departmentId,
    })
        .populate("department", "department_name code")
        .lean();

    return Promise.all(
        sections.map(async (section) => {
            const students = await Student.find({
                section: section._id,
            }).lean();

            return {
                ...section,
                students,
            };
        })
    );
};

const updateSection = (id, data) =>
    Section.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    })
        .populate("department", "department_name code")
        .populate("students");

const deleteSection = (id) => Section.findByIdAndDelete(id);

module.exports = {
    createSection,
    getAllSections,
    getSectionById,
    getSectionsByDepartment,
    updateSection,
    deleteSection,
};
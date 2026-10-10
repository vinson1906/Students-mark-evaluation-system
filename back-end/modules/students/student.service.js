const { Student } = require("./students.schema");

const createStudent = (data) => Student.create(data);

const getAllStudents = () =>
    Student.find()
        .populate("student_department")
        .populate("section")
        .populate("team");

const getStudentById = (id) =>
    Student.findById(id)
        .populate("student_department")
        .populate("section")
        .populate("team");

const getStudentsBySection = (sectionId) =>
    Student.find({ section: sectionId })
        .populate("student_department")
        .populate("section")
        .populate("team");

const getStudentByDepartment = (departmentId) => {
    Student.find({ student_department: departmentId })
        .populate("section")
        .populate("department")
        .populate("team")
}

const updateStudent = (id, data) =>
    Student.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    })
        .populate("student_department")
        .populate("section")
        .populate("team");

const deleteStudent = (id) => Student.findByIdAndDelete(id);

module.exports = {
    createStudent,
    getAllStudents,
    getStudentById,
    getStudentsBySection,
    updateStudent,
    deleteStudent,
    getStudentByDepartment
};
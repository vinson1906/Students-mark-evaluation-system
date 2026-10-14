const { Student } = require("./students.schema");

const createStudent = (data) => Student.create(data);

const getAllStudents = () =>
    Student.find()
        .populate("student_department", "department_name code")
        .populate("section", "section_name department year semester")
        .populate("team", "team_name team_number");

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

const getStudentByDepartment = (departmentId) =>
    Student.find({ student_department: departmentId })
        .populate("student_department")
        .populate("section")
        .populate("team");

const updateStudent = (id, data) =>
    Student.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
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
    getStudentByDepartment,
};
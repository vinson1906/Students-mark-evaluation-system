const { students } = require("./data");

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


const DEPARTMENT_ID = "6ae5aa1f05faafd3ba31f2f4";
const SECTION_ID = "6ae5aa2805faafd3ba31f2f5";

const Bulk_upload = async () => {

    let added = 0, skipped = 0, failed = 0;

    for (const s of students) {
        try {
            const exists = await Student.findOne({ student_reg: s.student_reg });
            if (exists) {
                console.log(`Skipped (already exists): ${s.student_reg}`);
                skipped++;
                continue;
            }

            await Student.create({
                student_name: s.student_name,
                student_reg: s.student_reg,
                student_department: DEPARTMENT_ID,
                section: SECTION_ID,
                // team not set
            });
            console.log(`Added: ${s.student_reg} - ${s.student_name}`);
            added++;
        } catch (err) {
            console.error(`Failed: ${s.student_reg} - ${err.message}`);
            failed++;
        }
    }

    console.log(`\nDone. Added: ${added}, Skipped: ${skipped}, Failed: ${failed}`);

}

module.exports = {
    createStudent,
    getAllStudents,
    getStudentById,
    getStudentsBySection,
    updateStudent,
    deleteStudent,
    getStudentByDepartment,
    Bulk_upload
};
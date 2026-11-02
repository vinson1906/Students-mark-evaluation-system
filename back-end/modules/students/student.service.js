

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




const Bulk_upload = async (students) => {
    let added = 0;
    let skipped = 0;
    let failed = 0;

    console.log("Bulk upload initiated:", students);

    try {
        const registerNumbers = students.map((s) =>
            s.student_reg.trim()
        );

        // 2. Find existing students in a single query
        const existingStudents = await Student.find({
            student_reg: { $in: registerNumbers },
        }).select("student_reg");

        const existingRegs = new Set(
            existingStudents.map((s) => s.student_reg)
        );

        const validStudents = [];

        for (const s of students) {
            if (!s.student_name?.trim() || !s.student_reg?.trim()) {
                failed++;
                continue;
            }

            const reg = s.student_reg.trim();

            if (existingRegs.has(reg)) {
                console.log(`Skipped (already exists): ${reg}`);
                skipped++;
                continue;
            }

            existingRegs.add(reg);

            validStudents.push({
                student_name: s.student_name.trim(),
                student_reg: reg,
                student_department: s.student_department,
                section: s.section,
            });
        }

        if (validStudents.length > 0) {
            const insertedStudents = await Student.insertMany(
                validStudents,
                { ordered: false }
            );

            added = insertedStudents.length;
        }

        console.log({
            added,
            skipped,
            failed,
        });

        return {
            success: true,
            message: "Bulk upload completed",
            added,
            skipped,
            failed,
        };

    } catch (err) {
        console.error("Bulk upload error:", err);

        return {
            success: false,
            message: err.message,
            added,
            skipped,
            failed,
        };
    }
};

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
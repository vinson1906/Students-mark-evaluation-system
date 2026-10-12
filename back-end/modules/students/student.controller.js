const mongoose = require("mongoose");
const service = require("./student.service");

const validId = (id) => mongoose.isValidObjectId(id);

const handleError = (res, error) => {
    if (error.code === 11000) {
        return res.status(409).json({
            message: "A student with this registration number already exists"
        });
    }

    if (error.name === "ValidationError" || error.name === "CastError") {
        return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: error.message });
};

exports.createStudent = async (req, res) => {
    try {
        const {
            student_name,
            student_reg,
            student_department,
            section
        } = req.body;

        if (
            !student_name?.trim() ||
            !student_reg?.trim() ||
            !student_department ||
            !section
        ) {
            return res.status(400).json({
                message:
                    "student_name, student_reg, student_department and section are required"
            });
        }

        if (
            !mongoose.isValidObjectId(student_department) ||
            !mongoose.isValidObjectId(section)
        ) {
            return res.status(400).json({
                message: "Invalid department or section ID"
            });
        }

        const student = await service.createStudent(req.body);

        return res.status(201).json({
            message: "Student created successfully",
            data: student
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Student registration number already exists"
            });
        }

        if (
            error.name === "ValidationError" ||
            error.name === "CastError"
        ) {
            return res.status(400).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

exports.getAllStudents = async (req, res) => {
    try {
        res.json({ data: await service.getAllStudents() });
    } catch (error) {
        handleError(res, error);
    }
};

exports.getStudentBydepartment = async (req, res) => {
    try {
        if (!validId(req.params.departmentId)) {
            return res.status(400).json({ message: "Invalid Department ID" });
        }
        
        res.json({ data: await service.getStudentByDepartment(req.params.departmentId) })
    }
    catch (err) {
        handleError(res, err);
    }
}

exports.getStudentById = async (req, res) => {
    try {
        if (!validId(req.params.id)) {
            return res.status(400).json({ message: "Invalid student ID" });
        }

        const student = await service.getStudentById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({ data: student });
    } catch (error) {
        handleError(res, error);
    }
};

exports.getStudentsBySection = async (req, res) => {
    try {
        if (!validId(req.params.sectionId)) {
            return res.status(400).json({ message: "Invalid section ID" });
        }

        res.json({
            data: await service.getStudentsBySection(req.params.sectionId)
        });
    } catch (error) {
        handleError(res, error);
    }
};

exports.updateStudent = async (req, res) => {
    try {
        if (!validId(req.params.id)) {
            return res.status(400).json({ message: "Invalid student ID" });
        }

        const allowed = ["student_name", "student_reg", "section", "team"];
        const data = {};

        for (const key of allowed) {
            if (req.body[key] !== undefined) data[key] = req.body[key];
        }

        for (const key of ["section", "team"]) {
            if (data[key] && !validId(data[key])) {
                return res.status(400).json({ message: `Invalid ${key} ID` });
            }
        }

        const student = await service.updateStudent(req.params.id, data);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({ message: "Student updated", data: student });
    } catch (error) {
        handleError(res, error);
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        if (!validId(req.params.id)) {
            return res.status(400).json({ message: "Invalid student ID" });
        }

        const student = await service.deleteStudent(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({ message: "Student deleted" });
    } catch (error) {
        handleError(res, error);
    }
};
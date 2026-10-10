const mongoose = require("mongoose");
const service = require("./marks.service");

const validId = (id) => mongoose.isValidObjectId(id);

const handleError = (res, error) => {
    if (error.name === "ValidationError" || error.name === "CastError") {
        return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: error.message });
};

exports.createMarks = async (req, res) => {
    try {
        const { student, team, lab, evaluatedBy, maximum_marks } = req.body;

        if (!student || !team || !lab || !evaluatedBy ||
            maximum_marks === undefined) {
            return res.status(400).json({
                message: "student, team, lab, evaluatedBy and maximum_marks are required"
            });
        }

        const ids = { student, team, lab, evaluatedBy };

        for (const [field, id] of Object.entries(ids)) {
            if (!validId(id)) {
                return res.status(400).json({
                    message: `Invalid ${field} ID`
                });
            }
        }

        if (!Number.isFinite(Number(maximum_marks)) || Number(maximum_marks) <= 0) {
            return res.status(400).json({
                message: "maximum_marks must be a positive number"
            });
        }

        const marks = await service.createMarks(req.body);

        res.status(201).json({
            message: "Evaluation created",
            data: marks
        });
    } catch (error) {
        handleError(res, error);
    }
};

exports.getAllMarks = async (req, res) => {
    try {
        res.json({ data: await service.getAllMarks() });
    } catch (error) {
        handleError(res, error);
    }
};

exports.getMarksById = async (req, res) => {
    try {
        if (!validId(req.params.id)) {
            return res.status(400).json({ message: "Invalid evaluation ID" });
        }

        const marks = await service.getMarksById(req.params.id);

        if (!marks) {
            return res.status(404).json({ message: "Evaluation not found" });
        }

        res.json({ data: marks });
    } catch (error) {
        handleError(res, error);
    }
};

const getByRelatedId = async (req, res, field, method) => {
    try {
        const id = req.params[field];

        if (!validId(id)) {
            return res.status(400).json({ message: `Invalid ${field} ID` });
        }

        res.json({ data: await method(id) });
    } catch (error) {
        handleError(res, error);
    }
};

exports.getMarksByStudent = (req, res) =>
    getByRelatedId(req, res, "studentId", service.getMarksByStudent);

exports.getMarksByTeam = (req, res) =>
    getByRelatedId(req, res, "teamId", service.getMarksByTeam);

exports.getMarksByLab = (req, res) =>
    getByRelatedId(req, res, "labId", service.getMarksByLab);

exports.updateMarks = async (req, res) => {
    try {
        if (!validId(req.params.id)) {
            return res.status(400).json({ message: "Invalid evaluation ID" });
        }

        const allowed = [
            "student",
            "team",
            "lab",
            "evaluation",
            "total_marks",
            "maximum_marks",
            "project_status",
            "evaluatedBy"
        ];

        const data = {};

        for (const key of allowed) {
            if (req.body[key] !== undefined) data[key] = req.body[key];
        }

        for (const key of ["student", "team", "lab", "evaluatedBy"]) {
            if (data[key] && !validId(data[key])) {
                return res.status(400).json({ message: `Invalid ${key} ID` });
            }
        }

        const marks = await service.updateMarks(req.params.id, data);

        if (!marks) {
            return res.status(404).json({ message: "Evaluation not found" });
        }

        res.json({ message: "Evaluation updated", data: marks });
    } catch (error) {
        handleError(res, error);
    }
};

exports.deleteMarks = async (req, res) => {
    try {
        if (!validId(req.params.id)) {
            return res.status(400).json({ message: "Invalid evaluation ID" });
        }

        const marks = await service.deleteMarks(req.params.id);

        if (!marks) {
            return res.status(404).json({ message: "Evaluation not found" });
        }

        res.json({ message: "Evaluation deleted" });
    } catch (error) {
        handleError(res, error);
    }
};
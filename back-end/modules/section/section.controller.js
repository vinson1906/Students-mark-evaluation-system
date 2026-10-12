const mongoose = require("mongoose");
const service = require("./section.service");

const validId = (id) => mongoose.isValidObjectId(id);

const handleError = (res, error) => {
    if (error.name === "ValidationError") {
        return res.status(400).json({ message: error.message });
    }

    if (error.name === "CastError") {
        return res.status(400).json({ message: "Invalid ID or field value" });
    }

    return res.status(500).json({ message: error.message });
};

exports.createSection = async (req, res) => {
    try {
        const { section_name, department } = req.body;

        if (!section_name?.trim() || !department) {
            return res.status(400).json({
                message: "section_name and department are required"
            });
        }

        if (!validId(department)) {
            return res.status(400).json({ message: "Invalid department ID" });
        }

        const section = await service.createSection(req.body);
        res.status(201).json({ message: "Section created", data: section });
    } catch (error) {
        handleError(res, error);
    }
};

exports.getAllSections = async (req, res) => {
    try {
        res.json({ data: await service.getAllSections() });
    } catch (error) {
        handleError(res, error);
    }
};

exports.getSectionById = async (req, res) => {
    try {
        if (!validId(req.params.id)) {
            return res.status(400).json({ message: "Invalid section ID" });
        }

        const section = await service.getSectionById(req.params.id);

        if (!section) {
            return res.status(404).json({ message: "Section not found" });
        }

        res.json({ data: section });
    } catch (error) {
        handleError(res, error);
    }
};

exports.getSectionsByDepartment = async (req, res) => {
    try {
        const { departmentId } = req.params;

        if (!validId(departmentId)) {
            return res.status(400).json({ message: "Invalid department ID" });
        }

        res.json({
            data: await service.getSectionsByDepartment(departmentId)
        });
    } catch (error) {
        handleError(res, error);
    }
};

exports.updateSection = async (req, res) => {
    try {
        if (!validId(req.params.id)) {
            return res.status(400).json({ message: "Invalid section ID" });
        }

        const allowed = ["section_name", "department", "year", "semester", "students"];
        const data = {};

        for (const key of allowed) {
            if (req.body[key] !== undefined) data[key] = req.body[key];
        }

        if (data.department && !validId(data.department)) {
            return res.status(400).json({ message: "Invalid department ID" });
        }

        const section = await service.updateSection(req.params.id, data);

        if (!section) {
            return res.status(404).json({ message: "Section not found" });
        }

        res.json({ message: "Section updated", data: section });
    } catch (error) {
        handleError(res, error);
    }
};

exports.deleteSection = async (req, res) => {
    try {
        if (!validId(req.params.id)) {
            return res.status(400).json({ message: "Invalid section ID" });
        }

        const section = await service.deleteSection(req.params.id);

        if (!section) {
            return res.status(404).json({ message: "Section not found" });
        }

        res.json({ message: "Section deleted" });
    } catch (error) {
        handleError(res, error);
    }
};
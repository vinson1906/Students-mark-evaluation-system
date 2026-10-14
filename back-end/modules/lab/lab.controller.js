const mongoose = require("mongoose");
const service = require("./lab.service");

const validId = (id) => mongoose.isValidObjectId(id);

const handleError = (res, error) => {
    if (error.code === 11000) {
        return res.status(409).json({
            message: "A lab with these details already exists"
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
        message: "Internal server error",
        error: error.message
    });
};

exports.createLab = async (req, res) => {
    try {
        const {
            department,
            lab_name,
            acadamic_year,
            maximum_mark
        } = req.body;

        console.log(req.body, department)

        if (
            !department ||
            !lab_name?.trim() ||
            !acadamic_year ||
            maximum_mark === undefined
        ) {
            return res.status(400).json({
                message:
                    "department, lab_name, academic_year and maximum_mark are required"
            });
        }

        if (!validId(department)) {
            return res.status(400).json({
                message: "Invalid department ID"
            });
        }

        if (
            !Number.isFinite(Number(maximum_mark)) ||
            Number(maximum_mark) < 1
        ) {
            return res.status(400).json({
                message: "maximum_mark must be a positive number"
            });
        }

        const lab = await service.createLab({
            department,
            acadamic_year,
            lab_name,
            maximum_mark
        });

        return res.status(201).json({
            message: "Lab created successfully",
            data: lab
        });
    } catch (error) {
        return handleError(res, error);
    }
};

exports.getAllLabs = async (req, res) => {
    try {
        const labs = await service.getAllLabs();

        return res.status(200).json({
            count: labs.length,
            data: labs
        });
    } catch (error) {
        return handleError(res, error);
    }
};

exports.getLabById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!validId(id)) {
            return res.status(400).json({
                message: "Invalid lab ID"
            });
        }

        const lab = await service.getLabById(id);

        if (!lab) {
            return res.status(404).json({
                message: "Lab not found"
            });
        }

        return res.status(200).json({ data: lab });
    } catch (error) {
        return handleError(res, error);
    }
};

exports.getLabsByDepartment = async (req, res) => {
    try {
        const { departmentId } = req.params;

        if (!validId(departmentId)) {
            return res.status(400).json({
                message: "Invalid department ID"
            });
        }

        const labs = await service.getLabsByDepartment(departmentId);

        return res.status(200).json({
            count: labs.length,
            data: labs
        });
    } catch (error) {
        return handleError(res, error);
    }
};

exports.updateLab = async (req, res) => {
    try {
        const { id } = req.params;

        if (!validId(id)) {
            return res.status(400).json({
                message: "Invalid lab ID"
            });
        }

        const allowedFields = [
            "department",
            "lab_name",
            "acadamic_year",
            "maximum_mark"
        ];

        const data = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                data[field] = req.body[field];
            }
        }

        if (
            data.department &&
            !validId(data.department)
        ) {
            return res.status(400).json({
                message: "Invalid department ID"
            });
        }

        if (
            data.maximum_mark !== undefined &&
            (!Number.isFinite(Number(data.maximum_mark)) ||
                Number(data.maximum_mark) < 1)
        ) {
            return res.status(400).json({
                message: "maximum_mark must be a positive number"
            });
        }

        const lab = await service.updateLab(id, data);

        if (!lab) {
            return res.status(404).json({
                message: "Lab not found"
            });
        }

        return res.status(200).json({
            message: "Lab updated successfully",
            data: lab
        });
    } catch (error) {
        return handleError(res, error);
    }
};

exports.deleteLab = async (req, res) => {
    try {
        const { id } = req.params;

        if (!validId(id)) {
            return res.status(400).json({
                message: "Invalid lab ID"
            });
        }

        const lab = await service.deleteLab(id);

        if (!lab) {
            return res.status(404).json({
                message: "Lab not found"
            });
        }

        return res.status(200).json({
            message: "Lab deleted successfully"
        });
    } catch (error) {
        return handleError(res, error);
    }
};
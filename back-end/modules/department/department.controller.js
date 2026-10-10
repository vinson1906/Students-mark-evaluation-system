const departmentService = require("./department.service");

const createDepartment = async (req, res) => {
    try {
        console.log(req.body)
        if (!req.body.department_name?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Department name is required",
            });
        }

        const department = await departmentService.createDepartment(req.body);

        return res.status(201).json({
            success: true,
            message: "Department created successfully",
            data: department,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Department already exists",
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getAllDepartments = async (req, res) => {
    try {
        const departments = await departmentService.getAllDepartments();

        return res.status(200).json({
            success: true,
            count: departments.length,
            data: departments,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getDepartmentById = async (req, res) => {
    try {
        const department = await departmentService.getDepartmentById(
            req.params.id
        );

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: department,
        });
    } catch (error) {
        const status = error.name === "CastError" ? 400 : 500;

        return res.status(status).json({
            success: false,
            message:
                status === 400 ? "Invalid department ID" : error.message,
        });
    }
};

const updateDepartment = async (req, res) => {
    try {
        const department = await departmentService.updateDepartment(
            req.params.id,
            req.body
        );

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Department updated successfully",
            data: department,
        });
    } catch (error) {
        const status =
            error.name === "CastError" ? 400 :
                error.code === 11000 ? 409 : 500;

        return res.status(status).json({
            success: false,
            message:
                status === 400 ? "Invalid ID or reference" :
                    status === 409 ? "Department name already exists" :
                        error.message,
        });
    }
};

const deleteDepartment = async (req, res) => {
    try {
        const department = await departmentService.deleteDepartment(
            req.params.id
        );

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Department deleted successfully",
            data: department,
        });
    } catch (error) {
        const status = error.name === "CastError" ? 400 : 500;

        return res.status(status).json({
            success: false,
            message:
                status === 400 ? "Invalid department ID" : error.message,
        });
    }
};

module.exports = {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
};
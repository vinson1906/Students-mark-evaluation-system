const mongoose = require("mongoose");
const facultyService = require("../services/faculty.service");

const isValidId = (id) => mongoose.isValidObjectId(id);

const handleError = (res, error) => {
  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Duplicate record",
    });
  }

  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: error.message,
  });
};

const createFaculty = async (req, res) => {
  try {
    const { faculty_name, department, lab } = req.body;

    if (!faculty_name?.trim() || !department || !lab) {
      return res.status(400).json({
        success: false,
        message: "Faculty name, department, and lab are required",
      });
    }

    if (!isValidId(department) || !isValidId(lab)) {
      return res.status(400).json({
        success: false,
        message: "Invalid department or lab ID",
      });
    }

    const faculty = await facultyService.createFaculty(req.body);

    return res.status(201).json({
      success: true,
      message: "Faculty created successfully",
      data: faculty,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const getAllFaculty = async (req, res) => {
  try {
    const faculty = await facultyService.getAllFaculty();

    return res.status(200).json({
      success: true,
      count: faculty.length,
      data: faculty,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const getFacultyById = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid faculty ID",
      });
    }

    const faculty = await facultyService.getFacultyById(req.params.id);

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: faculty,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const getFacultyByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;

    if (!isValidId(departmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid department ID",
      });
    }

    const faculty = await facultyService.getFacultyByDepartment(
      departmentId
    );

    return res.status(200).json({
      success: true,
      count: faculty.length,
      data: faculty,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const updateFaculty = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid faculty ID",
      });
    }

    if (req.body.department && !isValidId(req.body.department)) {
      return res.status(400).json({
        success: false,
        message: "Invalid department ID",
      });
    }

    if (req.body.lab && !isValidId(req.body.lab)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lab ID",
      });
    }

    const faculty = await facultyService.updateFaculty(
      req.params.id,
      req.body
    );

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Faculty updated successfully",
      data: faculty,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const deleteFaculty = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid faculty ID",
      });
    }

    const faculty = await facultyService.deleteFaculty(req.params.id);

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Faculty deleted successfully",
      data: faculty,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = {
  createFaculty,
  getAllFaculty,
  getFacultyById,
  getFacultyByDepartment,
  updateFaculty,
  deleteFaculty,
};
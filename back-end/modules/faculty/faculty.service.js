const { Faculty } = require("./faculty.schema");

const createFaculty = async (data) => {
  return await Faculty.create({
    faculty_name: data.faculty_name,
    department: data.department,
    lab: data.lab,
  });
};

const getAllFaculty = async () => {
  return await Faculty.find()
    .populate("department")
    .populate("lab");
};

const getFacultyById = async (id) => {
  return await Faculty.findById(id)
    .populate("department")
    .populate("lab");
};

const getFacultyByDepartment = async (departmentId) => {
  return await Faculty.find({
    department: departmentId,
  })
    .populate("department")
    .populate("lab");
};

const updateFaculty = async (id, data) => {
  const allowedFields = [
    "faculty_name",
    "department",
    "lab",
  ];

  const updates = {};

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updates[field] = data[field];
    }
  }

  return await Faculty.findByIdAndUpdate(
    id,
    { $set: updates },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("department")
    .populate("lab");
};

const deleteFaculty = async (id) => {
  return await Faculty.findByIdAndDelete(id);
};

module.exports = {
  createFaculty,
  getAllFaculty,
  getFacultyById,
  getFacultyByDepartment,
  updateFaculty,
  deleteFaculty,
};
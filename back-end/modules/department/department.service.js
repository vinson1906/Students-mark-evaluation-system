const { Department } = require("./department.schema");
const { Section } = require("../section/section.schema");

const createDepartment = async (data) => {
    return await Department.create({
        department_name: data.department_name,
        code: data.code,
        section: data.section || [],
    });
};

const getAllDepartments = async () => {
  const departments = await Department.find().lean();

  return Promise.all(
    departments.map(async (department) => {
      const sections = await Section.find({
        department: department._id,
      })
        .select("section_name year semester")
        .lean();

      return {
        ...department,
        section: sections,
      };
    })
  );
};

const getDepartmentById = async (id) => {
    return await Department.findById(id)
        .populate("section");
};

const updateDepartment = async (id, data) => {
    return await Department.findByIdAndUpdate(
        id,
        {
            $set: {
                ...(data.department_name !== undefined && {
                    department_name: data.department_name,
                }),
                ...(data.section !== undefined && {
                    section: data.section,
                }),
                ...(data.code !== undefined && {
                    code: data.code
                })
            },
        },
        {
            new: true,
            runValidators: true,
        }
    ).populate("section");
};

const deleteDepartment = async (id) => {
    return await Department.findByIdAndDelete(id);
};

module.exports = {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
};
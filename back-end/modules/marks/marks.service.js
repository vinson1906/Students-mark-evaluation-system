const { Marks } = require("./marks.schema");

const populateMarks = (query) =>
    query
        .populate("student")
        .populate("team")
        .populate("lab")
        .populate("evaluatedBy");

const createMarks = (data) => Marks.create(data);

const getAllMarks = () => populateMarks(Marks.find());

const getMarksById = (id) => populateMarks(Marks.findById(id));

const getMarksByStudent = (studentId) =>
    populateMarks(Marks.find({ student: studentId }));

const getMarksByTeam = (teamId) =>
    populateMarks(Marks.find({ team: teamId }));

const getMarksByLab = (labId) =>
    populateMarks(Marks.find({ lab: labId }));

const updateMarks = (id, data) =>
    populateMarks(
        Marks.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        })
    );

const deleteMarks = (id) => Marks.findByIdAndDelete(id);

module.exports = {
    createMarks,
    getAllMarks,
    getMarksById,
    getMarksByStudent,
    getMarksByTeam,
    getMarksByLab,
    updateMarks,
    deleteMarks
};
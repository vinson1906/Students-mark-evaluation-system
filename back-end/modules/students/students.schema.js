const mongoose = require("mongoose")

const Students_Schema = new mongoose.Schema({
    student_name: {
        type: String,
    },
    student_reg: {
        type: String
    },
    student_department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "departments"
    },
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "sections"
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "teams"
    }
})

const Student = mongoose.model("students", Students_Schema)

module.exports = {
    Student
}
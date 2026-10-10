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
        ref: "department"
    },
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "section"
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "team"
    }
})

const Student = mongoose.model("students", Students_Schema)

module.exports = {
    Student
}
const mongoose = require("mongoose")

const evaluation_Schema = new mongoose.Schema({
    practical_execution: {
        type: String
    },
    used_html: {
        type: String
    },
    js_logics: {
        type: String,
    },
    css_responsiveness: {
        type: String,
    },
    viva: {
        type: String,
    },
    documendation: {
        type: String
    },

})

const Mark_Schema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "students"
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "teams"
    },
    lab: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "labs"
    },
    evaluation: evaluation_Schema,
    total_marks: {
        type: String
    },
    maximum_marks: {
        type: String
    },
    project_status: {
        type: String,
        enum: ["COMPLETED", "NOT_COMPLETED", "PENDING"]
    },
    evaluatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "faculties"
    },

}, {
    timestamps: true
})

const Marks = mongoose.model("marks", Mark_Schema)

module.exports = {
    Marks
}
const mongoose = require("mongoose")


const Section_Schema = new mongoose.Schema({
    section_name: {
        type: String,
        require: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "departments",
        require: true
    },
    year: {
        type: Number
    },
    semester: {
        type: Number
    },
    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "students"
        }
    ]
})


const Section = mongoose.model("sections", Section_Schema)

module.exports = {
    Section
}
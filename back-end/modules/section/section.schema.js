const mongoose = require("mongoose")


const Section_Schema = new mongoose.Schema({
    section_name: {
        type: String,
        require: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "department",
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


const Section = mongoose.model("section", Section_Schema)

module.exports = {
    Section
}
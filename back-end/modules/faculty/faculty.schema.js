const mongoose = require("mongoose")

const Faculty_Schema = new mongoose.Schema({
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "department"
    },
    faculty_name: {
        type: String
    },
    lab: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "lab"
    }

})

const Faculty = mongoose.model("faculty", Faculty_Schema)

module.exports = {
    Faculty
}
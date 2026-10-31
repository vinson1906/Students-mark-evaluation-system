const mongoose = require("mongoose")

const Faculty_Schema = new mongoose.Schema({
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "departments"
    },
    faculty_name: {
        type: String
    },
    lab: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "labs"
    }

})

const Faculty = mongoose.model("faculties", Faculty_Schema)

module.exports = {
    Faculty
}
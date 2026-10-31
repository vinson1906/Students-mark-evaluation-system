const mongoose = require("mongoose")

const Department_Schema = new mongoose.Schema({
    department_name: {
        type: String,
        require: true,
        unique: true
    },
    section: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "sections"
    }],
    code: {
        type: String
    }

}, {
    timestamps: true
})

const Department = mongoose.model("departments", Department_Schema)

module.exports = {
    Department
}



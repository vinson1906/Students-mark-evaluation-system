const mongoose = require("mongoose")

const Lab_Schema = new mongoose.Schema({
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "departments"
    },
    lab_name: {
        type: String
    },
    acadamic_year: {
        type: String
    },
    maximum_mark: {
        type: String
    }
})

const Lab = mongoose.model("labs", Lab_Schema)

module.exports = {
    Lab
}
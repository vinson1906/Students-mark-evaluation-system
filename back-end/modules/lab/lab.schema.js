const mongoose = require("mongoose")

const Lab_Schema = new mongoose.Schema({
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "department"
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

const Lab = mongoose.model("lab", Lab_Schema)

module.exports = {
    Lab
}
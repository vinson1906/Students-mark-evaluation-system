const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    user_name: {
        type: String,
        required: true,
    },
    user_email: {
        type: String,
        required: true,
    },
    user_password: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    user_role: {
        type: String,
        enum: ['admin', 'faculty', 'student'],
        required: true
    }
})

const User = mongoose.model("User", userSchema)

module.exports = { User }
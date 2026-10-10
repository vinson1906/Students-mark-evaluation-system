const mongoose = require("mongoose")

const project_Schema = new mongoose.Schema({
    title: {
        type: String
    },
    github_url: {
        type: String
    },
    report_status: {
        type: String,
        enum: ["NOT_SUBMITTED", "PENDING"]
    },
    project_status: {
        type: String,
        enum: ["NOT_SUBMITTED", "PENDING"]
    }
})

const Team_Schema = new mongoose.Schema({
    team_name: {
        type: String,
    },
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "section"
    },
    team_number: {
        type: String
    },
    team_members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "students"
        }
    ],
    project: project_Schema
})

const Team = mongoose.model("team", Team_Schema)

module.exports = {
    Team
}
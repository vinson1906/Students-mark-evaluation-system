const mongoose = require("mongoose");
const service = require("./team.service");

const validId = (id) => mongoose.isValidObjectId(id);

const handleError = (res, error) => {
    if (error.name === "ValidationError" || error.name === "CastError") {
        return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: error.message });
};

exports.createTeam = async (req, res) => {
    try {
        const { team_name, team_number, section } = req.body;

        if (!team_name?.trim() || !team_number || !section) {
            return res.status(400).json({
                message: "team_name, team_number and section are required"
            });
        }

        if (!validId(section)) {
            return res.status(400).json({ message: "Invalid section ID" });
        }

        const team = await service.createTeam(req.body);
        res.status(201).json({ message: "Team created", data: team });
    } catch (error) {
        handleError(res, error);
    }
};

exports.getAllTeams = async (req, res) => {
    try {
        res.json({ data: await service.getAllTeams() });
    } catch (error) {
        handleError(res, error);
    }
};

exports.getTeamById = async (req, res) => {
    try {
        if (!validId(req.params.id)) {
            return res.status(400).json({ message: "Invalid team ID" });
        }

        const team = await service.getTeamDetails(req.params.id);

        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }

        res.json({ data: team });
    } catch (error) {
        handleError(res, error);
    }
};

exports.getTeamsBySection = async (req, res) => {
    try {
        if (!validId(req.params.sectionId)) {
            return res.status(400).json({ message: "Invalid section ID" });
        }

        res.json({
            data: await service.getTeamsBySection(req.params.sectionId)
        });
    } catch (error) {
        handleError(res, error);
    }
};

exports.updateTeam = async (req, res) => {
    try {
        if (!validId(req.params.id)) {
            return res.status(400).json({ message: "Invalid team ID" });
        }

        const allowed = [
            "team_name",
            "team_number",
            "section",
            "team_members",
            "project"
        ];

        const data = {};

        for (const key of allowed) {
            if (req.body[key] !== undefined) data[key] = req.body[key];
        }

        if (data.section && !validId(data.section)) {
            return res.status(400).json({ message: "Invalid section ID" });
        }

        if (
            data.team_members &&
            (!Array.isArray(data.team_members) ||
                data.team_members.some((id) => !validId(id)))
        ) {
            return res.status(400).json({
                message: "team_members must be an array of valid student IDs"
            });
        }

        const team = await service.updateTeam(req.params.id, data);

        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }

        res.json({ message: "Team updated", data: team });
    } catch (error) {
        handleError(res, error);
    }
};

exports.deleteTeam = async (req, res) => {
    try {
        if (!validId(req.params.id)) {
            return res.status(400).json({ message: "Invalid team ID" });
        }

        const team = await service.deleteTeam(req.params.id);

        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }

        res.json({ message: "Team deleted" });
    } catch (error) {
        handleError(res, error);
    }
};
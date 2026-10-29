const mongoose = require("mongoose");
const { Marks } = require("../marks/marks.schema");

const buildLabMatch = (labId) => {
    if (!labId) return {};

    if (!mongoose.Types.ObjectId.isValid(labId)) {
        throw new Error("Invalid lab ID");
    }

    return {
        lab: new mongoose.Types.ObjectId(labId),
    };
};

const getTopTeamsService = async ({ labId } = {}) => {
    const matchStage = buildLabMatch(labId);

    const results = await Marks.aggregate([
        {
            $match: matchStage,
        },

        // Get team details
        {
            $lookup: {
                from: "teams",
                localField: "team",
                foreignField: "_id",
                as: "team",
            },
        },
        {
            $unwind: "$team",
        },

        // Calculate each team's average total marks
        {
            $group: {
                _id: "$team._id",
                team_name: {
                    $first: "$team.team_name",
                },
                team_avg: {
                    $avg: {
                        $convert: {
                            input: "$total_marks",
                            to: "double",
                            onError: 0,
                            onNull: 0,
                        },
                    },
                },
            },
        },

        // Highest average first
        {
            $sort: {
                team_avg: -1,
                _id: 1,
            },
        },

        // Only top 5 teams
        {
            $limit: 5,
        },

        // Return only required fields
        {
            $project: {
                _id: 0,
                id: {
                    $toString: "$_id",
                },
                team_name: 1,
                team_avg: {
                    $round: ["$team_avg", 2],
                },
            },
        },
    ]);

    // Add ranks
    return results.map((team, index) => ({
        ...team,
        rank: index + 1,
    }));
};

const getTopStudentsService = async ({ labId } = {}) => {
    const matchStage = buildLabMatch(labId);

    const results = await Marks.aggregate([
        { $match: matchStage },

        {
            $lookup: {
                from: "students",
                localField: "student",
                foreignField: "_id",
                as: "student",
            },
        },
        { $unwind: "$student" },

        {
            $group: {
                _id: "$student._id",
                student_name: {
                    $first: "$student.student_name",
                },
                reg_no: {
                    $first: "$student.student_reg",
                },
                total_marks: {
                    $avg: {
                        $convert: {
                            input: "$total_marks",
                            to: "double",
                            onError: 0,
                            onNull: 0,
                        },
                    },
                },
            },
        },

        {
            $sort: {
                total_marks: -1,
                _id: 1,
            },
        },

        { $limit: 5 },

        {
            $project: {
                _id: 0,
                id: { $toString: "$_id" },
                student_name: 1,
                reg_no: 1,
                total_marks: { $round: ["$total_marks", 2] },
            },
        },
    ]);

    return results.map((student, index) => ({
        ...student,
        rank: index + 1,
    }));
};

module.exports = {
    getTopTeamsService,
    getTopStudentsService,
};
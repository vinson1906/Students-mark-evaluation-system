const { Marks } = require("./marks.schema");
const mongoose = require("mongoose")

const populateMarks = (query) =>
    query
        .populate("student")
        .populate("team")
        .populate("lab")
        .populate("evaluatedBy");

const createMarks = (data) => Marks.create(data);

const getAllMarks = () => populateMarks(Marks.find());

const getMarksById = (id) => populateMarks(Marks.findById(id));

const getMarksByStudent = (studentId) =>
    populateMarks(Marks.find({ student: studentId }));

const getMarksByTeam = (teamId) =>
    populateMarks(Marks.find({ team: teamId }));

const getMarksByLab = (labId) =>
    populateMarks(Marks.find({ lab: labId }));

const updateMarks = (id, data) =>
    populateMarks(
        Marks.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        })
    );

const deleteMarks = (id) => Marks.findByIdAndDelete(id);


const getStudentDetailsService = async (studentId, labId = null) => {
    try {
        // Validate ObjectIds
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            throw new Error("Invalid student ID");
        }

        if (labId && !mongoose.Types.ObjectId.isValid(labId)) {
            throw new Error("Invalid lab ID");
        }

        const studentObjectId = new mongoose.Types.ObjectId(studentId);
        const labObjectId = labId
            ? new mongoose.Types.ObjectId(labId)
            : null;

        // 1. Get all evaluated students for the selected lab
        const evaluatedStudents = await Marks.aggregate([
            {
                $match: {
                    ...(labObjectId && { lab: labObjectId })
                }
            },

            // Join Student
            {
                $lookup: {
                    from: "students",
                    localField: "student",
                    foreignField: "_id",
                    as: "student"
                }
            },
            { $unwind: "$student" },

            // Join Team
            {
                $lookup: {
                    from: "teams",
                    localField: "team",
                    foreignField: "_id",
                    as: "team"
                }
            },
            {
                $unwind: {
                    path: "$team",
                    preserveNullAndEmptyArrays: true
                }
            },

            // Join Section
            {
                $lookup: {
                    from: "sections",
                    localField: "team.section",
                    foreignField: "_id",
                    as: "section"
                }
            },
            {
                $unwind: {
                    path: "$section",
                    preserveNullAndEmptyArrays: true
                }
            },

            // Join Department
            {
                $lookup: {
                    from: "departments",
                    localField: "section.department",
                    foreignField: "_id",
                    as: "department"
                }
            },
            {
                $unwind: {
                    path: "$department",
                    preserveNullAndEmptyArrays: true
                }
            },

            // Convert marks to numbers and calculate percentage
            {
                $addFields: {
                    numericTotal: {
                        $convert: {
                            input: "$total_marks",
                            to: "double",
                            onError: 0,
                            onNull: 0
                        }
                    },
                    numericMaximum: {
                        $convert: {
                            input: "$maximum_marks",
                            to: "double",
                            onError: 0,
                            onNull: 0
                        }
                    }
                }
            },
            {
                $addFields: {
                    total_avg: {
                        $cond: [
                            { $gt: ["$numericMaximum", 0] },
                            {
                                $multiply: [
                                    {
                                        $divide: [
                                            "$numericTotal",
                                            "$numericMaximum"
                                        ]
                                    },
                                    100
                                ]
                            },
                            0
                        ]
                    }
                }
            },

            // Return required data
            {
                $project: {
                    _id: 1,

                    student_id: "$student._id",
                    student_name: "$student.student_name",
                    reg_no: "$student.student_reg",

                    department_code: "$department.department_code",
                    section: "$section.section_name",
                    year: "$section.year",
                    semester: "$section.semester",

                    total_avg: 1,

                    marks: "$evaluation",

                    project: "$team.project",

                    team_id: "$team._id",
                    team_name: "$team.team_name",
                    team_code: "$team.team_number",
                    team_members: "$team.team_members"
                }
            }
        ]);

        if (!evaluatedStudents.length) {
            throw new Error("No evaluated students found for this lab");
        }

        // 2. Sort evaluated students by average
        evaluatedStudents.sort(
            (a, b) => b.total_avg - a.total_avg
        );

        // 3. Calculate ranks (competition ranking)
        let previousAverage = null;
        let currentRank = 0;

        evaluatedStudents.forEach((student, index) => {
            if (student.total_avg !== previousAverage) {
                currentRank = index + 1;
            }

            student.rank = currentRank;
            previousAverage = student.total_avg;
        });

        // 4. Find requested student
        const selectedStudent = evaluatedStudents.find(
            student =>
                student.student_id.toString() === studentObjectId.toString()
        );

        if (!selectedStudent) {
            throw new Error("Student has not been evaluated for this lab");
        }

        // 5. Grade calculation
        const getGrade = (average) => {
            if (average >= 90) return "A";
            if (average >= 80) return "B+";
            if (average >= 70) return "B";
            if (average >= 60) return "C";
            if (average >= 50) return "D";
            if (average >= 45) return "E";
            return "Fail";
        };

        // 6. Get evaluated team members only
        const teamMembers = evaluatedStudents.filter(
            student =>
                student.team_id &&
                selectedStudent.team_id &&
                student.team_id.toString() ===
                selectedStudent.team_id.toString()
        );

        // 7. Calculate team average
        const teamAverage = teamMembers.length
            ? teamMembers.reduce(
                (sum, member) => sum + member.total_avg,
                0
            ) / teamMembers.length
            : 0;

        // 8. Format team members
        const formattedTeamMembers = teamMembers.map(member => ({
            student_id: member.student_id,
            reg_no: member.reg_no,
            student_name: member.student_name,
            rank: String(member.rank),
            total_avg: member.total_avg.toFixed(2)
        }));

        // 9. Format final response
        const response = {
            student_name: selectedStudent.student_name,
            reg_no: selectedStudent.reg_no,

            department_code: selectedStudent.department_code || "",
            section: selectedStudent.section || "",
            year: String(selectedStudent.year || ""),
            semester: String(selectedStudent.semester || ""),

            rank: String(selectedStudent.rank),
            total_avg: selectedStudent.total_avg.toFixed(2),
            grade: getGrade(selectedStudent.total_avg),

            marks: {
                practical_exqution:
                    selectedStudent.marks?.practical_execution || "",

                used_html:
                    selectedStudent.marks?.used_html || "",

                js_logic:
                    selectedStudent.marks?.js_logics || "",

                css_responsiveness:
                    selectedStudent.marks?.css_responsiveness || "",

                viva:
                    selectedStudent.marks?.viva || "",

                documendation:
                    selectedStudent.marks?.documendation || ""
            },

            project: {
                project_name:
                    selectedStudent.project?.title || "",

                github:
                    selectedStudent.project?.github_url || "",

                project_status:
                    selectedStudent.project?.project_status || ""
            },

            team_perfomence: {
                team_id: selectedStudent.team_id || "",
                team_avg: teamAverage.toFixed(2),
                team_name: selectedStudent.team_name || "",
                team_code: selectedStudent.team_code || "",

                team_members: formattedTeamMembers
            }
        };

        return response;

    } catch (error) {
        console.error("Student Details Service Error:", error);
        throw error;
    }
};


module.exports = {
    createMarks,
    getAllMarks,
    getMarksById,
    getMarksByStudent,
    getMarksByTeam,
    getMarksByLab,
    updateMarks,
    deleteMarks,
    getStudentDetailsService
};
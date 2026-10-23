const express = require("express")
const cors = require("cors")
const app = express()
const connectDB = require("./config/db")

const dotenv = require("dotenv")
const DepartmentRouter = require("./modules/department/department.routes")
const SectionRouter = require("./modules/section/section.routes")
const StudentRouter = require("./modules/students/student.routes")
const TeamRouter = require("./modules/team/team.routes")
const MarkRouter = require("./modules/marks/marks.routes")
const LabRouter = require("./modules/lab/lab.routes")
const facultyRouter = require("./modules/faculty/faculty.routes")
const UserRouter = require("./modules/user/user.routes")
const cookieParser = require("cookie-parser");

app.use(express.urlencoded({ extended: true }));

dotenv.config()
connectDB()

const PORT = process.env.PORT

app.use(
    cors({
        origin: ["http://localhost:5173", "https://student-mark-evaluvation-sysytem.netlify.app/"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api", DepartmentRouter)
app.use("/api/section", SectionRouter)
app.use("/api/students", StudentRouter)
app.use("/api/teams", TeamRouter)
app.use("/api/marks", MarkRouter)
app.use("/api/labs", LabRouter)
app.use("/api/faculty", facultyRouter)
app.use("/api/user", UserRouter)

app.get("/api", (req, res) => {
    res.json({
        "data": "server running on port 7000"
    })
})






app.listen(PORT, () => {
    console.log(`server is running on port number: ${PORT}`)
})
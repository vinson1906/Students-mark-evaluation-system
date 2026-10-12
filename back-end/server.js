const express = require("express")
const cors = require("cors")
const app = express()
const connectDB = require("./config/db")

const dotenv = require("dotenv")
const DepartmentRouter = require("./modules/department/department.routes")
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config()
connectDB()

const PORT = process.env.PORT
app.use(cors())

app.use("/api", DepartmentRouter)

app.get("/api", (req, res) => {
    res.json({
        "data": "server running on port 7000"
    })
})

app.listen(PORT, () => {
    console.log(`server is running on port number: ${PORT}`)
})
const service = require("./user.service")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const createUser = async (req, res) => {
    try {
        const result = await service.createUser(req.body)
        res.json({
            data: result,
        })
    }
    catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const result = await service.getAllUsers()
        res.status(200).json({
            data: result
        })
    }
    catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
}

const getUserById = async (req, res) => {
    try {
        const result = await service.getUserById(req.params.id)
        res.status(200).json({
            data: result
        })
    }
    catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const result = await service.deleteUser(req.params.id)
        res.status(201).json({
            message: "User deleted successfully",
            data: result
        })
    }
    catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const result = await service.updateUser(req.params.id, req.body)
        res.status(200).json({
            message: "User updated successfully",
            data: result
        })
    }
    catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
}


const login = async (req, res) => {
    try {
        // console.log("data");

        const { user_email, user_password } = req.body;
        console.log("data are:", user_email, user_password);

        if (!user_email || !user_password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const user = await service.getUserByEmail(user_email);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const isPasswordValid = await bcrypt.compare(
            user_password,
            user.user_password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                user_role: user.user_role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite:
                process.env.NODE_ENV === "production"
                    ? "none"
                    : "lax",
            maxAge: 24 * 60 * 60 * 1000,
            path: "/",
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                user_name: user.user_name,
                user_email: user.user_email,
                user_role: user.user_role,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message,
        });
    }
};


const authSuccess = async (req, res) => {
    try {

        const data = req.user;
        return res.status(200).json({
            success: true,
            message: "Authentication successful",
            user: data
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve user data",
            error: error.message,
        });
    }
}

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    deleteUser,
    updateUser,
    login,
    authSuccess
}

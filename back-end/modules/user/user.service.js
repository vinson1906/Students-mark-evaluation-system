const { User } = require('./user.schema');
const bcrypt = require('bcrypt');

const createUser = async (data) => {
    if (!data.user_name || !data.user_email || !data.user_password || !data.phone_number || !data.user_role) {
        throw new Error("Missing required fields");
    }

    const hashedPassword = await bcrypt.hash(data.user_password, 10);

    const userData = {
        user_name: data.user_name,
        user_email: data.user_email,
        user_password: hashedPassword,
        phone_number: data.phone_number,
        user_role: data.user_role
    };

    return User.create(userData);
}

const getAllUsers = () => {
    return User.find();
}

const getUserById = (id) => {
    if (!id) {
        throw new Error("User ID is required");
    }
    return User.findById(id);
}

const deleteUser = async (id) => {

    const user = await User.findById(id);
    console.log("user data:", user);

    if (!user) {
        throw new Error("User not found");
    }

    if (!id) {
        throw new Error("User ID is required");
    }

    return User.findByIdAndDelete(id);
}




const updateUser = (id, data) => {
    if (!id) {
        throw new Error("User ID is required");
    }
    return User.findByIdAndUpdate(id, data, { new: true });
}

const getUserByEmail = (email) => {
    if (!email) {
        throw new Error("User email is required");
    }
    return User.findOne({ user_email: email });
}

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    getUserByEmail,
    deleteUser,
    updateUser
}
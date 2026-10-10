const mongoose = require("mongoose")
const dotenv = require("dotenv")

const connectDB = async () => {
    const URI = process.env.MONGO_URI

    try {
        await mongoose.connect(`${URI}`)
        console.log('MongoDB connected successfully!');
    }
    
    catch (err) {
        console.error("Error accross connecting to mongoDB", err)
    }
}

module.exports = connectDB
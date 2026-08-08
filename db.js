const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connection Fully Establshed: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Connection Failed: ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;
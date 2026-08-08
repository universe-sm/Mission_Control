const mongoose = require("mongoose");

const userschema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter valid email"]
    },
    password: {
        type: String,
        required: true,
    }
});

const taskschema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    priority: {
        type: String,
        required: true,
        enum: ["low", "medium", "critical"]
    },
    status: {
        type: String,
        default: "pending",
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    creationdate: {
        type: Date,
        default: new Date()
    }

});

const usermodel = mongoose.model("User", userschema);
const taskmodel = mongoose.model("Task", taskschema);

module.exports = { usermodel, taskmodel };




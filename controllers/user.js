const { usermodel } = require("../models/model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

const createuser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const strongpasswordregex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        if (!strongpasswordregex.test(password)) {
            return res.status(400).json({ error: "Weak Password! Enter a strong password with at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a special character(@,$,!,%,*,?,&,#)." });
        }
        const hashedpassword = await bcrypt.hash(password, 10);
        const user = await usermodel.create({ username, email, password: hashedpassword });
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const loginuser = async (req, res) => {
    try {
        const { username } = req.body;
        const login_user = await usermodel.findOne({ username });
        if (!login_user) {
            return res.status(404).json({ error: "Username Not Found" });
        }
        const { password } = req.body;
        const ismatch = await bcrypt.compare(password, login_user.password);
        if (!ismatch) {
            return res.status(401).json({ error: "Incorrect Password" });
        }
        const token = JWT.sign({ id: login_user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(200).json({ message: "Login Successfull", token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getusername = async (req, res) => {
    try {
        const user = await usermodel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "Successfull", user});
    }

    catch (error) {
        res.status(500).json({ error: "Server Error" });

    }
}
module.exports = { createuser, loginuser , getusername };
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./db");
const userroutes=require("./routes/userroutes")
const taskroutes=require("./routes/taskroutes");
const cors = require("cors");
const app=express();
const authMiddleware=require("./middleware/auth");
connectDB();
app.use(cors());
app.use(express.json());
app.use("/users",userroutes);
app.use("/tasks",authMiddleware,taskroutes);
app.listen(8000,()=>{
    console.log("Server Listening at : http://localhost:8000");
})
const { taskmodel } = require("../models/model");

const createtask = async (req, res) => {
    try {
        const { title, description, priority, status } = req.body;
        const task = await taskmodel.create({ title, description, priority, status, userID: req.user.id });
        res.status(201).json({ message: "Succesfully Created" , task});
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }

}

const updatetask = async (req, res) => {
    try {
        const taskid = req.params.id;
        const task = await taskmodel.findOneAndUpdate({ _id: taskid, userID: req.user.id }, req.body, { new: true, runValidators: true });
        if (!task) {
            return res.status(404).json({ error: "Task not found or not yours" });
        }
        res.status(200).json({ message: "Updation Done Successfully", task });
    }
    catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
}


const deletetask = async (req, res) => {
    try {
        const taskid = req.params.id;
        const task = await taskmodel.findOneAndDelete({ _id: taskid, userID: req.user.id });
        if (!task) {
            return res.status(404).json({ error: "Task not found or not yours" });
        }
        res.status(200).json({ message: "Deletion Done Successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
}

const gettasks = async (req, res) => {
    try {
        const task = await taskmodel.find({ userID: req.user.id });
        res.status(200).json(task);
    }
    catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
}



module.exports = { createtask, updatetask, deletetask ,gettasks};
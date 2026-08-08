const { createtask, updatetask, deletetask, gettasks } = require("../controllers/task");
const express=require("express");
const router=express.Router();

router.post("/create",createtask);
router.put("/update/:id",updatetask);
router.delete("/delete/:id",deletetask);
router.get("/getall",gettasks);

module.exports=router;

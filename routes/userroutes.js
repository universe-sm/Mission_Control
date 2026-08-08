const { createuser, loginuser, getusername } = require("../controllers/user");
const express = require("express");
const router = express.Router();
const authMiddleware=require("../middleware/auth");

router.post("/signup", createuser);
router.post("/login", loginuser);
router.get("/getuser",authMiddleware, getusername);

module.exports = router;

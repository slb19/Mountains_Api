const express=require("express");
const router=express.Router();
const usersControllers=require("../controllers/users.js")

router.post("/register", usersControllers.registerNewUser)

module.exports=router;
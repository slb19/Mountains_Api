const express=require("express");
const router=express.Router();
const mountainsControllers=require("../controllers/mountains.js");
const dataValidation=require("../middlewares/dataValidation.js");

router.get("/api/mountains", dataValidation, mountainsControllers.consumeApi)

module.exports=router;
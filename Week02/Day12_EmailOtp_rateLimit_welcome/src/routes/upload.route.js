const express=require("express");
const uploadSingleFile = require("../controller/upload.controller");
const uploadMiddleware = require("../middleware/multer");

const router=express.Router();

// api--->api/v2/uploads/upload-single
// multer is a middleware 
router.post("/upload-single",uploadMiddleware().single('file'), uploadSingleFile);

module.exports=router;



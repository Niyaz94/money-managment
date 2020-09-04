const express=require("express");
const router= express.Router();
const category=require("../controllers/movies/category");
const tag=require("../controllers/movies/tag");

router.post("/category",category.returnInfo);
router.post("/tag",tag.returnInfo);

module.exports=router;
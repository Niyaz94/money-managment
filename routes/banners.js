const express =require("express");
const router = express.Router();

    
const bannerController=require("../controllers/banners/channel");
router.post("/",bannerController.returnInfo);

module.exports= router;
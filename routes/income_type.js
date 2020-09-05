const express =require("express");
const router = express.Router();



const money_type_controller=require("../controllers/income_type");

router.post(
    "/",
    require("../middleware/general/check_requist_content_type").check_requist_content_type("json"),
    money_type_controller.insertData
);
router.get("/",money_type_controller.getData);
router.put("/",money_type_controller.updateData);
router.delete("/",money_type_controller.deleteData);


module.exports=router;
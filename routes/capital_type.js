const express =require("express");
const router = express.Router();


const capital_type_controller=require("../controllers/capital_type");

router.post(
    "/",
    require("../middleware/general/check_requist_content_type").check_requist_content_type("json"),
    capital_type_controller.insertData
);

router.put(
    "/:id",
    require("../middleware/general/check_requist_content_type").check_requist_content_type("json"),
    capital_type_controller.updateData
);

router.get("/:id",capital_type_controller.getData);
router.get("/",capital_type_controller.getAllData);


router.delete("/:id",capital_type_controller.deleteData);


module.exports=router;
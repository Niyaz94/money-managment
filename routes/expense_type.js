const express =require("express");
const router = express.Router();


const expense_type_controller=require("../controllers/expense_type");

router.post(
    "/",
    require("../middleware/general/check_requist_content_type").check_requist_content_type("json"),
    expense_type_controller.insertData
);

router.put(
    "/:id",
    require("../middleware/general/check_requist_content_type").check_requist_content_type("json"),
    expense_type_controller.updateData
);

router.get("/:id",expense_type_controller.getData);
router.get("/",expense_type_controller.getAllData);


router.delete("/:id",expense_type_controller.deleteData);


module.exports=router;
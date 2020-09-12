const express =require("express");
const router = express.Router();



const money_type_controller=require("../controllers/income");

router.route("/")
.post(
    require("../middleware/general/check_requist_content_type").check_requist_content_type("json"),
    money_type_controller.insertData
)
.get(money_type_controller.getAllData);

router.route("/:id")
.get(money_type_controller.getData)
.put(money_type_controller.updateData)
.delete(money_type_controller.deleteData);


module.exports=router;
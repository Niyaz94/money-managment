const express       = require("express");
const validator     = require("../validation/expense");
const controller    = require("../controllers/expense");

const router = express.Router();

router.route("/")
    .post(
        [
            require("../middleware/general/check_requist_content_type").check_requist_content_type("json"),
            validator.insertValidateData
        ],
        controller.insertData
    ).get(
        controller.getAllData
    );

router.route("/:id")
    .get(
        [
            validator.validateID
        ],
        controller.getData
    ).put(
        [
            require("../middleware/general/check_requist_content_type").check_requist_content_type("json"),
            validator.updateValidateData
        ],
        controller.updateData
    ).delete(
        [
            validator.validateID
        ],
        controller.deleteData
    );


module.exports=router;
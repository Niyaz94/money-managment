const express       = require("express");
const validator     = require("../validation/expense");
const controller    = require("../controllers/expense");

const router        = express.Router();
const imageUpload      = require("../middleware/uploader").single('uploads/expense',"image");


router.route("/")
    .post(
        [
            imageUpload,
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
const express       = require("express");
const validator     = require("../validation/exchange");
const controller    = require("../controllers/exchange");
const imageUpload   = require("../middleware/uploader").plural('uploads/exchange',["buyImage","sellImage"]);


const router = express.Router();

router.route("/")
    .post(
        [imageUpload,validator.insertValidateData],
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
            imageUpload,
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
const express       = require("express");
const validator     = require("../validation/user");
const controller    = require("../controllers/user");

const router = express.Router();

router.route("/")
    .post(
        [
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
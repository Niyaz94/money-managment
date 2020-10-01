const express       = require("express");
const validator     = require("../validation/capital_type");
const controller    = require("../controllers/capital_type");

const router = express.Router();

router.post("/",
    [
        validator.insertValidateData
    ],
    controller.insertData
);
router.put("/:id",
    [
        validator.updateValidateData
    ],
    controller.updateData
);
router.get("/:id",
    [
        validator.validateID
    ],
    controller.getData
);
router.get("/",
    [

    ],
    controller.getAllData
);
router.delete("/:id",
    [
        validator.validateID
    ],
    controller.deleteData
);
module.exports=router;
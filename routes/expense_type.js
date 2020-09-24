const express       = require("express");
const validator     = require("../validation/expense_type");
const controller    = require("../controllers/expense_type");

const router = express.Router();

router.post("/",
    [
        require("../middleware/general/check_requist_content_type").check_requist_content_type("json"),
        validator.insertValidateData
    ],
    controller.insertData
);
router.put("/:id",
    [
        require("../middleware/general/check_requist_content_type").check_requist_content_type("json"),
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
    [],
    controller.getAllData
);
router.delete("/:id",
    [
        validator.validateID
    ],
    controller.deleteData
);
module.exports=router;
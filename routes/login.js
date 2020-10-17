const express       = require("express");
const validator     = require("../validation/login");
const controller    = require("../controllers/login");

const router = express.Router();

router.route("/").post([validator.login],controller.login);

module.exports=router;
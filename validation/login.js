const user              = require("../models/user");
const {PASSWORD,NAME}   = require("./rules/validation_rules");
const {case1}           = require("./rules/validation_errors");

exports.login = [
    NAME("name"),
    PASSWORD("password"),
    case1
];
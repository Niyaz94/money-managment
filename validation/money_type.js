const moneyType         = require("../models/moneyType");
const {ID,NAME,EXIST}   = require("./rules/validation_rules");
const {case1}           = require("./rules/validation_errors");

exports.validateID = [
    ID("id"),
    EXIST(moneyType,"id","id"),
    case1
];
exports.insertValidateData = [
    NAME("name","c1"),
    EXIST(moneyType,"name","name"),
    case1
];
exports.updateValidateData = [
    ID("id"),
    EXIST(moneyType,"id","id","param","not_exist"),
    NAME("name","c1"),
    EXIST(moneyType,"name","name"),
    case1
];
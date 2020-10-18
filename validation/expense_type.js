const expenseType           = require("../models/expenseType");
const {ID,NAME,EXIST,TEXT}  = require("./rules/validation_rules");
const {case1}               = require("./rules/validation_errors");

exports.validateID = [
    ID("id"),
    EXIST(expenseType,"id","id","param","not_exist"),
    case1
];
exports.insertValidateData = [
    TEXT("note"),
    NAME("name","c2"),
    EXIST(expenseType,"name","name"),
    case1
];
exports.updateValidateData = [
    TEXT("note"),
    ID("id"),
    EXIST(expenseType,"id","id","param","not_exist"),
    NAME("name"),
    EXIST(expenseType,"name","name"),
    case1
];
const incomeType= require("../models/incomeType");

const {ID,NAME,EXIST,TEXT}=require("./rules/validation_rules");
const {case1}=require("./rules/validation_errors");

exports.validateID = [
    ID("id"),
    EXIST(incomeType,"id","id","param","not_exist"),
    case1
];
exports.insertValidateData = [
    TEXT("note"),
    NAME("name"),
    EXIST(incomeType,"name","name"),
    case1
];
exports.updateValidateData = [
    TEXT("note"),
    ID("id"),
    EXIST(incomeType,"id","id","param","not_exist"),
    NAME("name"),
    EXIST(incomeType,"name","name"),
    case1
];
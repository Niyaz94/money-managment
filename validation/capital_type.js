const capitalType= require("../models/capitalType");

const {ID,NAME,EXIST,TEXT}=require("./rules/validation_rules");
const {case1}=require("./rules/validation_errors");

exports.validateID = [
    ID("id"),
    EXIST(capitalType,"id","id","param","not_exist",{row_type:"dynamic"}),
    case1
];
exports.insertValidateData = [
    NAME("name"),
    EXIST(capitalType,"name","name"),
    TEXT("note"),
    case1
];
exports.updateValidateData = [
    ID("id"),
    EXIST(capitalType,"id","id","param","not_exist"),
    NAME("name"),
    EXIST(capitalType,"name","name"),
    TEXT("note"),
    case1
];
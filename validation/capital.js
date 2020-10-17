const capitalType   = require("../models/capitalType");
const moneyType     = require("../models/moneyType");
const capital       = require("../models/capital");


const {ID,EXIST,TEXT,DATE,INT,FLOAT}=require("./rules/validation_rules");
const {case1}=require("./rules/validation_errors");

exports.validateID = [
    ID("id"),
    EXIST(capital,"id","id","param","not_exist"),
    case1
];
exports.insertValidateData = [
    TEXT("note"),
    DATE("date"),
    INT("capitalTypeFid",1,1000),
    EXIST(capitalType,"id","capitalTypeFid","body","not_exist"),
    INT("moneyTypeFid",1,1000),
    EXIST(moneyType,"id","moneyTypeFid","body","not_exist"),
    FLOAT("amount"),
    case1
];
exports.updateValidateData = [
    ID("id"),
    TEXT("note"),
    DATE("date"),
    INT("capitalTypeFid",1,1000),
    EXIST(capitalType,"id","capitalTypeFid","body","not_exist"),
    INT("moneyTypeFid",1,1000),
    EXIST(moneyType,"id","moneyTypeFid","body","not_exist"),
    FLOAT("amount"),
    case1
];
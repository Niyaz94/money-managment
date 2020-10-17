const moneyType     = require("../models/moneyType");
const property      = require("../models/property");


const {ID,EXIST,NAME,TEXT,DATE,IN,INT,FLOAT}=require("./rules/validation_rules");
const {case1}=require("./rules/validation_errors");

exports.validateID = [
    ID("id"),
    EXIST(property,"id","id","param","not_exist"),
    case1
];
exports.insertValidateData = [
    NAME("name"),
    IN("capitalAction",["yes","no"]),
    IN("state",['own', 'sell', 'useless']),
    INT("moneyTypeFid",1,1000),
    EXIST(moneyType,"id","moneyTypeFid","body","not_exist"),
    FLOAT("amount"),
    DATE("date"),
    TEXT("note"),
    case1
];
exports.updateValidateData = [
    ID("id"),
    NAME("name"),
    IN("capitalAction",["yes","no"]),
    IN("state",['own', 'sell', 'useless']),
    INT("moneyTypeFid",1,1000),
    EXIST(moneyType,"id","moneyTypeFid","body","not_exist"),
    FLOAT("amount"),
    DATE("date"),
    TEXT("note"),
    case1
];
const expenseType                       = require("../models/expenseType");
const moneyType                         = require("../models/moneyType");
const expense                           = require("../models/expense");
const {ID,EXIST,TEXT,DATE,INT,FLOAT}    = require("./rules/validation_rules");
const {case1}                           = require("./rules/validation_errors");

exports.validateID = [
    ID("id"),
    EXIST(expense,"id","id","param","not_exist"),
    case1
];
exports.insertValidateData = [
    TEXT("note"),
    DATE("date"),
    INT("expenseTypeFid",1,1000),
    EXIST(expenseType,"id","expenseTypeFid","body","not_exist"),
    INT("moneyTypeFid",1,1000),
    EXIST(moneyType,"id","moneyTypeFid","body","not_exist"),
    FLOAT("amount"),
    case1
];
exports.updateValidateData = [
    ID("id"),
    TEXT("note"),
    DATE("date"),
    INT("expenseTypeFid",1,1000),
    EXIST(expenseType,"id","expenseTypeFid","body","not_exist"),
    INT("moneyTypeFid",1,1000),
    EXIST(moneyType,"id","moneyTypeFid","body","not_exist"),
    FLOAT("amount"),
    case1
];
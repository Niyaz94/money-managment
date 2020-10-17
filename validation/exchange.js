const moneyType     = require("../models/moneyType");
const exchange      = require("../models/exchange");

const {ID,EXIST,TEXT,DATE,INT,FLOAT,EQUALITY}=require("./rules/validation_rules");
const {case1}=require("./rules/validation_errors");

exports.validateID = [
    ID("id"),
    EXIST(exchange,"id","id","param","not_exist"),
    case1
];
exports.insertValidateData = [
    TEXT("note"),
    DATE("date"),
    FLOAT("sellAmount"),
    FLOAT("buyAmount"),
    INT("sellMoneyTypeId",1,1000),
    INT("buyMoneyTypeId",1,1000),
    EXIST(moneyType,"id","sellMoneyTypeId","body","not_exist"),
    EXIST(moneyType,"id","buyMoneyTypeId","body","not_exist"),
    EQUALITY("not_equal","sellMoneyTypeId","buyMoneyTypeId"),
    case1
];
exports.updateValidateData = [
    ID("id"),
    EXIST(exchange,"id","id","param","not_exist"),
    TEXT("note"),
    DATE("date"),
    FLOAT("sellAmount"),
    FLOAT("buyAmount"),
    INT("sellMoneyTypeId",1,1000),
    INT("buyMoneyTypeId",1,1000),
    EXIST(moneyType,"id","sellMoneyTypeId","body","not_exist"),
    EXIST(moneyType,"id","buyMoneyTypeId","body","not_exist"),
    EQUALITY("not_equal","sellMoneyTypeId","buyMoneyTypeId"),
    case1
];
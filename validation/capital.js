const capitalType   = require("../models/capitalType");
const moneyType     = require("../models/moneyType");
const capital       = require("../models/capital");


const {check_id,check_capital_type,check_exist,check_text2,check_date,check_int,check_float}=require("./extra");
const {case1}=require("./vm");

exports.validateID = [
    check_id("id"),
    check_exist(capital,"id","id","param","not_exist"),
    case1
];
exports.insertValidateData = [
    check_text2("note"),
    check_date("date"),
    check_int("capitalTypeFid",1,1000),
    check_exist(capitalType,"id","capitalTypeFid","body","not_exist"),
    check_int("moneyTypeFid",1,1000),
    check_exist(moneyType,"id","moneyTypeFid","body","not_exist"),
    check_float("amount"),
    check_capital_type("capitalTypeFid"),
    case1
];
exports.updateValidateData = [
    check_id("id"),
    check_text2("note"),
    check_date("date"),
    check_int("capitalTypeFid",1,1000),
    check_exist(capitalType,"id","capitalTypeFid","body","not_exist"),
    check_int("moneyTypeFid",1,1000),
    check_exist(moneyType,"id","moneyTypeFid","body","not_exist"),
    check_float("amount"),
    case1
];
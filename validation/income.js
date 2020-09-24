const incomeType= require("../models/incomeType");
const moneyType= require("../models/moneyType");

const {check_id,check_exist,check_text,check_date,check_int,check_float}=require("./extra");
const {case1}=require("./vm");

exports.validateID = [
    check_id("id"),
    check_exist(incomeType,"id","id","param","not_exist"),
    case1
];
exports.insertValidateData = [
    check_text("note"),
    check_date("date"),
    check_int("incomeTypeFid",1,1000),
    check_exist(incomeType,"id","incomeTypeFid","body","not_exist"),
    check_int("moneyTypeFid",1,1000),
    check_exist(moneyType,"id","moneyTypeFid","body","not_exist"),
    check_float("amount"),
    case1
];
exports.updateValidateData = [
    check_id("id"),
    check_text("note"),
    check_date("date"),
    check_int("incomeTypeFid",1,1000),
    check_exist(incomeType,"id","incomeTypeFid","body","not_exist"),
    check_int("moneyTypeFid",1,1000),
    check_exist(moneyType,"id","moneyTypeFid","body","not_exist"),
    check_float("amount"),
    case1
];
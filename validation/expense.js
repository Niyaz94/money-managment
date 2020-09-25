const expenseType   = require("../models/expenseType");
const moneyType     = require("../models/moneyType");
const expense       = require("../models/expense");


const {check_id,check_exist,check_text,check_date,check_int,check_float}=require("./extra");
const {case1}=require("./vm");

exports.validateID = [
    check_id("id"),
    check_exist(expense,"id","id","param","not_exist"),
    case1
];
exports.insertValidateData = [
    check_text("note"),
    check_date("date"),
    check_int("expenseTypeFid",1,1000),
    check_exist(expenseType,"id","expenseTypeFid","body","not_exist"),
    check_int("moneyTypeFid",1,1000),
    check_exist(moneyType,"id","moneyTypeFid","body","not_exist"),
    check_float("amount"),
    case1
];
exports.updateValidateData = [
    check_id("id"),
    check_text("note"),
    check_date("date"),
    check_int("expenseTypeFid",1,1000),
    check_exist(expenseType,"id","expenseTypeFid","body","not_exist"),
    check_int("moneyTypeFid",1,1000),
    check_exist(moneyType,"id","moneyTypeFid","body","not_exist"),
    check_float("amount"),
    case1
];
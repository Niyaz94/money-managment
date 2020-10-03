const moneyType     = require("../models/moneyType");
const property      = require("../models/property");


const {check_id,check_exist,check_name2,check_text2,check_date,check_in,check_int,check_float}=require("./extra");
const {case1}=require("./vm");

exports.validateID = [
    check_id("id"),
    check_exist(property,"id","id","param","not_exist"),
    case1
];
exports.insertValidateData = [
    check_name2("name"),
    check_in("capitalAction",["yes","no"]),
    check_in("state",['own', 'sell', 'useless']),
    check_int("moneyTypeFid",1,1000),
    check_exist(moneyType,"id","moneyTypeFid","body","not_exist"),
    check_float("amount"),
    check_date("date"),
    check_text2("note"),
    case1
];
exports.updateValidateData = [
    check_id("id"),
    check_name2("name"),
    check_in("capitalAction",["yes","no"]),
    check_in("state",['own', 'sell', 'useless']),
    check_int("moneyTypeFid",1,1000),
    check_exist(moneyType,"id","moneyTypeFid","body","not_exist"),
    check_float("amount"),
    check_date("date"),
    check_text2("note"),
    case1
];
const moneyType     = require("../models/moneyType");
const exchange      = require("../models/exchange");

const {check_id,check_exist,check_text,check_date,check_int,check_float,check_equality}=require("./extra");
const {case1}=require("./vm");

exports.validateID = [
    check_id("id"),
    check_exist(exchange,"id","id","param","not_exist"),
    case1
];
exports.insertValidateData = [
    check_text("note"),
    check_date("date"),
    check_float("sellAmount"),
    check_float("buyAmount"),
    check_int("sellMoneyTypeId",1,1000),
    check_int("buyMoneyTypeId",1,1000),
    check_exist(moneyType,"id","sellMoneyTypeId","body","not_exist"),
    check_exist(moneyType,"id","buyMoneyTypeId","body","not_exist"),
    check_equality("not_equal","sellMoneyTypeId","buyMoneyTypeId"),
    case1
];
exports.updateValidateData = [
    check_id("id"),
    check_exist(exchange,"id","id","param","not_exist"),
    check_text("note"),
    check_date("date"),
    check_float("sellAmount"),
    check_float("buyAmount"),
    check_int("sellMoneyTypeId",1,1000),
    check_int("buyMoneyTypeId",1,1000),
    check_exist(moneyType,"id","sellMoneyTypeId","body","not_exist"),
    check_exist(moneyType,"id","buyMoneyTypeId","body","not_exist"),
    check_equality("not_equal","sellMoneyTypeId","buyMoneyTypeId"),
    case1
];
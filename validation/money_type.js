const moneyType= require("../models/moneyType");

const {check_id,check_name,check_exist}=require("./extra");
const {case1}=require("./vm");

exports.validateID = [
    check_id("id"),
    check_exist(moneyType,"id","id"),
    case1
];
exports.insertValidateData = [
    check_name("name"),
    check_exist(moneyType,"name","name"),
    case1
];
exports.updateValidateData = [
    check_id("id"),
    check_exist(moneyType,"id","id","param","not_exist"),
    check_name("name"),
    check_exist(moneyType,"name","name"),
    case1
];
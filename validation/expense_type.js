const expenseType= require("../models/expenseType");

const {check_id,check_name2,check_exist,check_text}=require("./extra");
const {case1}=require("./vm");

exports.validateID = [
    check_id("id"),
    check_exist(expenseType,"id","id","param","not_exist"),
    case1
];
exports.insertValidateData = [
    check_text("note"),
    check_name2("name"),
    check_exist(expenseType,"name","name"),
    case1
];
exports.updateValidateData = [
    check_text("note"),
    check_id("id"),
    check_exist(expenseType,"id","id","param","not_exist"),
    check_name2("name"),
    check_exist(expenseType,"name","name"),
    case1
];
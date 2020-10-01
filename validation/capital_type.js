const capitalType= require("../models/capitalType");

const {check_id,check_name2,check_exist,check_text}=require("./extra");
const {case1}=require("./vm");

exports.validateID = [
    check_id("id"),
    check_exist(capitalType,"id","id","param","not_exist",{row_type:"dynamic"}),
    case1
];
exports.insertValidateData = [
    check_name2("name"),
    check_exist(capitalType,"name","name"),
    check_text("note"),
    case1
];
exports.updateValidateData = [
    check_id("id"),
    check_exist(capitalType,"id","id","param","not_exist"),
    check_name2("name"),
    check_exist(capitalType,"name","name"),
    check_text("note"),
    case1
];
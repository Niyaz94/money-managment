const user        = require("../models/user");

const {check_id,check_exist,check_email,check_name}=require("./extra");
const {case1}=require("./vm");

exports.validateID = [
    check_id("id"),
    check_exist(user,"id","id","param","not_exist"),
    case1
];
exports.insertValidateData = [
    check_name("name"),
    check_exist(user,"name","name","body","exist"),
    check_email("email"),
    check_exist(user,"email","email","body","exist"),
    //adding password check
    //adding conferm password
    case1
];
exports.updateValidateData = [
    check_name("name"),
    check_exist(user,"name","name","body","exist",{}),//should fix this one
    check_email("email"),
    check_exist(user,"email","email","body","exist",{}),
    case1
];
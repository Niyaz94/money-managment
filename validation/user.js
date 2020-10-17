const user        = require("../models/user");

const {ID,EXIST,PASSWORD,EMAIL,NAME,EQUALITY}=require("./rules/validation_rules");
const {case1}=require("./rules/validation_errors");


exports.insertValidateData = [
    NAME("name"),
    EXIST(user,"name","name","body","exist"),
    EMAIL("email"),
    EXIST(user,"email","email","body","exist"),
    PASSWORD("password"),
    EQUALITY("equal","password","cpassword"),
    case1
];

exports.validateID = [
    ID("id"),
    EXIST(user,"id","id","param","not_exist"),
    case1
];
exports.updateValidateData = [
    NAME("name"),
    EXIST(user,"name","name","body","exist"),
    EMAIL("email"),
    EXIST(user,"email","email","body","exist"),
    PASSWORD("password"),
    EQUALITY("equal","password","cpassword"),
    case1
];
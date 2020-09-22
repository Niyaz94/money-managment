const {validationResult} = require('express-validator');
const {check_id,check_name}=require("./extra");
const {case1}=require("./vm");

exports.validateID = [
    check_id("id"),
    case1
];
exports.insertValidateData = [
    check_name("name"),
    case1
];
exports.updateValidateData = [
    check_id("id"),
    check_name("name"),
    case1
];

const {body,param} = require('express-validator');

const check_name=(filed)=>{
    return body(filed)
    .exists().withMessage('The name field does not exist!')
    .isAlphanumeric().withMessage('Should contains only letters and numbers!')
    .trim()
    .escape()
    .not().isEmpty().withMessage('The name can not be empty!')
    .isLength({min: 3}).withMessage('Minimum 3 characters required!')
    .bail();
}
const check_id=(filed)=>{
    return param(filed)
    .exists().withMessage('The id param does not exist!')
    .trim()
    .escape()
    .isInt({min:1}).withMessage('Should be integer number above 0!')
    .bail();
}

module.exports ={
    check_id:check_id,
    check_name:check_name
}
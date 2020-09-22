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

const check_exist=(module,filed)=>{
    return body(filed).custom((value,{req})=>{
        return module.findOne({where:{[filed]:value}}).then(new_module=>{
            if(new_module){
                return Promise.reject("This value is already exist!");
            }
        });
    })
}

module.exports ={
    check_id:check_id,
    check_name:check_name,
    check_exist:check_exist
}
const {body,param}  = require('express-validator');
const {Op}          = require("sequelize");

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
const check_date=(filed)=>{
    return body(filed)
                .exists().withMessage('The name field does not exist!')
                .trim()
                .escape()
                .not().isEmpty().withMessage('The name can not be empty!')
                .bail();
}
const check_float=(filed)=>{
    return body(filed)
                .exists().withMessage('The name field does not exist!')
                .trim()
                .escape()
                .not().isEmpty().withMessage('The name can not be empty!')
                .isNumeric({min:0,max:1000000000}).withMessage('Should be integer number between 0 and 1000000000!')
                .bail();
}
const check_int=(filed)=>{
    return body(filed)
                .exists().withMessage('The name field does not exist!')
                .trim()
                .escape()
                .not().isEmpty().withMessage('The name can not be empty!')
                .isInt({min:0,max:1000000000}).withMessage('Should be integer number between 0 and 1000000000!')
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
const check_text=(filed)=>{
    return body(filed)
                .trim()
                .escape()
                .isLength({max:50}).withMessage('Content should be almost 50  characters!')
                .matches(/^[a-z0-9 ]+$|^$/i).withMessage('Should contains only letters and numbers!')
                .bail();
}

const check_exist=(module,filed,parser_type="body",exist_type="exist"/** exist,not_exist*/)=>{
    if(parser_type=="param" && exist_type=="not_exist"){//give you error if the value not found
        return param(filed).custom((value,{req})=>{
            return module.findOne({where:{[filed]:value}}).then(new_module=>{
                if(new_module==null){
                    return Promise.reject("This value is not exist!");
                }
            });
        })
    }else if(parser_type=="param" && exist_type=="exist"){//give you error if the value found
        return param(filed).custom((value,{req})=>{
            return module.findOne({where:{[filed]:value}}).then(new_module=>{
                if(new_module){
                    return Promise.reject("This value is already exist!");
                }
            });
        })
    }else if(parser_type=="body" && exist_type=="not_exist"){
        return param(filed).custom((value,{req})=>{
            return module.findOne({where:{[filed]:value}}).then(new_module=>{
                if(new_module){
                    return Promise.reject("This value is not exist!");
                }
            });
        })
    }else{
        return body(filed).custom((value,{req})=>{
            let extra={};
            if(!isNaN(req.params.id) && req.params.id>0){
                extra={id: {[Op.ne]: req.params.id}};
            }
            return module.findOne({where:{[filed]:value,...extra}}).then(new_module=>{
                if(new_module){
                    return Promise.reject("This value is already exist!");
                }
            });
        });
    }
}
module.exports ={
    check_id:check_id,
    check_name:check_name,
    check_exist:check_exist,
    check_text:check_text,
    check_int:check_int
}
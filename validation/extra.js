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
                .isDate({
                    format:"YYYY-mm-dd"
                }).withMessage('The date format is wrong!')
                .bail();
}
const check_float=(filed,min=0,max=1000000000)=>{
    extra={min:min,max:max};
    if(min!==undefined && !isNaN(min)){
        extra["min"]=min;
    }
    if(max!==undefined && !isNaN(max)){
        extra["max"]=max;
    }
    return body(filed)
                .exists().withMessage('The name field does not exist!')
                .trim()
                .escape()
                .not().isEmpty().withMessage('The name can not be empty!')
                .isNumeric({min:0,max:1000000000}).withMessage(`Should be integer number between ${min!==undefined?min:0} and ${max!==undefined?max:1000000000}!`)
                .bail();
}
const check_int=(filed,min=0,max=1000000000)=>{
    extra={min:min,max:max};
    if(min!==undefined && !isNaN(min)){
        extra["min"]=min;
    }
    if(max!==undefined && !isNaN(max)){
        extra["max"]=max;
    }
    return body(filed)
                .exists().withMessage('The name field does not exist!')
                .trim()
                .escape()
                .toInt()
                .not().isEmpty().withMessage('The name can not be empty!')
                .isInt(extra).withMessage(`Should be integer number between ${min!==undefined?min:0} and ${max!==undefined?max:1000000000}!`)
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
const check_exist=(module,db_filed,body_field,parser_type="body",exist_type="exist"/** exist,not_exist*/)=>{
    if(parser_type=="param" && exist_type=="not_exist"){//give you error if the value not found
        return param(body_field).custom((value,{req})=>{
            return module.findOne({where:{[db_filed]:value}}).then(new_module=>{
                if(new_module==null){
                    return Promise.reject("This value is not exist!");
                }
            });
        })
    }else if(parser_type=="param" && exist_type=="exist"){//give you error if the value found
        return param(body_field).custom((value,{req})=>{
            return module.findOne({where:{[db_filed]:value}}).then(new_module=>{
                if(new_module){
                    return Promise.reject("This value is already exist!");
                }
            });
        })
    }else if(parser_type=="body" && exist_type=="not_exist"){
        return body(body_field).custom((value,{req})=>{
            return module.findOne({where:{[db_filed]:value}}).then(new_module=>{
                if(new_module==null){
                    return Promise.reject("This value is not exist!");
                }
            });
        })
    }else{
        return body(body_field).custom((value,{req})=>{
            let extra={};
            if(!isNaN(req.params.id) && req.params.id>0){
                extra={id: {[Op.ne]: req.params.id}};
            }
            return module.findOne({where:{[db_filed]:value,...extra}}).then(new_module=>{
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
    check_int:check_int,
    check_date:check_date,
    check_float:check_float
}
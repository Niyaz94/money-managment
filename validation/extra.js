const {body,param}  = require('express-validator');
const {Op}          = require("sequelize");

const check_name=(field)=>{
    return body(field)
                .exists().withMessage(`The ${field} field does not exist!`)
                .isAlphanumeric().withMessage('Should contains only letters and numbers!')
                .trim()
                .escape()
                .not().isEmpty().withMessage(`The ${field} can not be empty!`)
                .isLength({min: 3}).withMessage('Minimum 3 characters required!')
                .bail();
}
const check_name2=(field)=>{
    return body(field)
                .exists().withMessage(`The ${field} field does not exist!`)
                .matches(/^[a-z0-9 ]+$|^$/i).withMessage('Should contains only letters and numbers!')
                .trim()
                .escape()
                .not().isEmpty().withMessage(`The ${field} can not be empty!`)
                .isLength({min: 3}).withMessage('Minimum 3 characters required!')
                .bail();
}
const check_date=(field)=>{
    return body(field)
                .exists().withMessage(`The ${field} field does not exist!`)
                .trim()
                .escape()
                .not().isEmpty().withMessage(`The ${field} can not be empty!`)
                .isDate({
                    format:"YYYY-mm-dd"
                }).withMessage(`The ${field} format is wrong!`)
                .bail();
}
const check_float=(field,min=0,max=1000000000)=>{
    extra={min:min,max:max};
    if(min!==undefined && !isNaN(min)){
        extra["min"]=min;
    }
    if(max!==undefined && !isNaN(max)){
        extra["max"]=max;
    }
    return body(field)
                .exists().withMessage(`The ${field} field does not exist!`)
                .trim()
                .escape()
                .not().isEmpty().withMessage(`The ${field} can not be empty!`)
                .isNumeric({min:0,max:1000000000}).withMessage(`Should be integer number between ${min!==undefined?min:0} and ${max!==undefined?max:1000000000}!`)
                .bail();
}
const check_int=(field,min=0,max=1000000000)=>{
    extra={min:min,max:max};
    if(min!==undefined && !isNaN(min)){
        extra["min"]=min;
    }
    if(max!==undefined && !isNaN(max)){
        extra["max"]=max;
    }
    return body(field)
                .exists().withMessage(`The ${field} field does not exist!`)
                .trim()
                .escape()
                .toInt()
                .not().isEmpty().withMessage(`The ${field} can not be empty!`)
                .isInt(extra).withMessage(`Should be integer number between ${min!==undefined?min:0} and ${max!==undefined?max:1000000000}!`)
                .bail();
}
const check_in=(field,values)=>{
    return body(field)
                .exists().withMessage(`The ${field} field does not exist!`)
                .isAlpha().withMessage('Should contains only letters!')
                .trim()
                .escape()
                .not().isEmpty().withMessage(`The ${field} can not be empty!`)
                .isIn(values).withMessage(`The value should be one of those value (${values.join(", ")}) !`)
                .bail();
}
/*
    it check for id usually from the url check it if it is number above zero or not
*/
const check_id=(field)=>{
    return param(field)
                .exists().withMessage('The id param does not exist!')
                .trim()
                .escape()
                .isInt({min:1}).withMessage('Should be integer number above 0!')
                .bail();
}
const check_text=(field)=>{
    return body(field)
                .trim()
                .escape()
                .isLength({max:100}).withMessage('Content should be almost 50  characters!')
                .matches(/^[a-z0-9 ,.]+$|^$/i).withMessage('Should contains only letters and numbers!')
                .bail();
}
const check_text2=(field)=>{
    return body(field)
                .trim()
                .escape()
                .isLength({max:100}).withMessage('Content should be almost 50  characters!')
                .bail();
}
const check_exist=(module,db_field,body_field,parser_type="body",exist_type="exist"/** exist,not_exist*/,conditions={})=>{
    if(parser_type=="param" && exist_type=="not_exist"){//give you error if the value not found
        return param(body_field).custom((value,{req})=>{
            return module.findOne({where:{[db_field]:value,...conditions}}).then(new_module=>{
                if(new_module==null){
                    return Promise.reject("This value is not exist!");
                }
            });
        })
    }else if(parser_type=="param" && exist_type=="exist"){//give you error if the value found
        return param(body_field).custom((value,{req})=>{
            return module.findOne({where:{[db_field]:value,...conditions}}).then(new_module=>{
                if(new_module){
                    return Promise.reject("This value is already exist!");
                }
            });
        })
    }else if(parser_type=="body" && exist_type=="not_exist"){
        return body(body_field).custom((value,{req})=>{
            return module.findOne({where:{[db_field]:value,...conditions}}).then(new_module=>{
                if(new_module==null){
                    return Promise.reject("This value is not exist!");
                }
            });
        })
    }else{
        return body(body_field).custom((value,{req})=>{
            if(!isNaN(req.params.id) && req.params.id>0){
                conditions={id: {[Op.ne]: req.params.id},...conditions};
            }
            return module.findOne({where:{[db_field]:value,...conditions}}).then(new_module=>{
                if(new_module){
                    return Promise.reject("This value is already exist!");
                }
            });
        });
    }
}
const check_equality=(type="equal",field,check_field)=>{
    if(type=="equal"){
        return body(field).custom((value,{req})=>{
            if (value !== req.body[check_field]) {
                throw new Error('Both field should have the same value!');
            }
            return true;
        })
    }else if(type=="not_equal"){
        return body(field).custom((value,{req})=>{
            if (value === req.body[check_field]) {
                throw new Error('The fields should have different value!');
            }
            return true;
        })
    }
}
module.exports ={
    check_id:check_id,
    check_name:check_name,
    check_name2:check_name2,
    check_exist:check_exist,
    check_text:check_text,
    check_text2:check_text2,
    check_int:check_int,
    check_date:check_date,
    check_float:check_float,
    check_equality:check_equality,
    check_in:check_in
}
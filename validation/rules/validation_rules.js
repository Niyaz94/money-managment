const {body,param}  = require('express-validator');
const {Op}          = require("sequelize");

const NAME=(field,type="c1")=>{
    const validator=body(field)
    .exists().withMessage(`The ${field} field does not exist!`).bail()
    .trim()
    .escape()
    .not().isEmpty().withMessage(`The ${field} can not be empty!`).bail();
    if(type=="c1"){
        validator.isAlphanumeric().withMessage('Should contains only letters and numbers!').bail()
    }else if(type=="c2"){
        validator.matches(/^[a-z0-9 ]+$|^$/i).withMessage('Should contains only letters and numbers!').bail()
    }
    return validator.isLength({min: 3,max:20}).withMessage(`The ${field} length should be between 3 and 20 characters.`).bail();
}
const PASSWORD=(field)=>{
    return body(field)
                .exists().withMessage(`The ${field} field does not exist!`)
                .trim()
                .escape()
                .not().isEmpty().withMessage(`The ${field} can not be empty!`)
                .isLength({min: 8}).withMessage('Minimum 3 characters required!')
                .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[#?!@$%^&*-])[0-9a-zA-Z_#?!@$%^&*-]{8,}$/, "i").withMessage(`The password formrat is wrong!`)
                .bail();
}
const EMAIL=(field)=>{
    return body(field)
                .exists().withMessage(`The ${field} field does not exist!`)
                .trim()
                .escape()
                .not().isEmpty().withMessage(`The ${field} can not be empty!`)
                .isEmail().withMessage('The email format not correct!')
                .bail();
}
const DATE=(field)=>{
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
const FLOAT=(field,min=0,max=1000000000)=>{
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
const INT=(field,min=0,max=1000000000)=>{
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
const IN=(field,values)=>{
    return body(field)
                .exists().withMessage(`The ${field} field does not exist!`)
                .isAlpha().withMessage('Should contains only letters!')
                .trim()
                .escape()
                .not().isEmpty().withMessage(`The ${field} can not be empty!`)
                .isIn(values).withMessage(`The value should be one of those value (${values.join(", ")}) !`)
                .bail();
}
const ID=(field)=>{
    /*
        it check for id usually from the url check it if it is number above zero or not
    */
    return param(field)
                .exists().withMessage('The id param does not exist!')
                .trim()
                .escape()
                .isInt({min:1}).withMessage('Should be integer number above 0!')
                .bail();
}
const TEXT=(field,type="c1")=>{
    const validator=body(field)
                .trim()
                .escape()
                .isLength({max:100}).withMessage('Content should be almost 50  characters!').bail();

    if(type=="c2"){
        validator.matches(/^[a-z0-9 ,.]+$|^$/i).withMessage('Should contains only letters and numbers!');
    }
    return validator;
}
const EXIST=(module,db_field,body_field,parser_type="body",exist_type="exist"/** exist,not_exist*/,conditions={})=>{
    if(parser_type=="param" && exist_type=="not_exist"){//give you error if the value not found
        return param(body_field).custom((value,{req})=>{
            return module.findOne({where:{[db_field]:value,...conditions}}).then(new_module=>{
                if(new_module==null){
                    return Promise.reject(`This ${body_field} is not exist!`);
                }
            });
        })
    }else if(parser_type=="param" && exist_type=="exist"){//give you error if the value found
        return param(body_field).custom((value,{req})=>{
            return module.findOne({where:{[db_field]:value,...conditions}}).then(new_module=>{
                if(new_module){
                    return Promise.reject(`This ${body_field} is already exist!`);
                }
            });
        })
    }else if(parser_type=="body" && exist_type=="not_exist"){
        return body(body_field).custom((value,{req})=>{
            return module.findOne({where:{[db_field]:value,...conditions}}).then(new_module=>{
                if(new_module==null){
                    return Promise.reject(`This ${body_field} is not exist!`);
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
                    return Promise.reject(`This ${body_field} is already exist!`);
                }
            });
        });
    }
}
const EQUALITY=(type="equal",field,check_field)=>{
    if(type=="equal"){
        return body(field).custom((value,{req})=>{
            if (req.body[check_field]===undefined || value !== req.body[check_field]) {
                throw new Error(`Both '${field}' and '${check_field}' should have the same value!`);
            }
            return true;
        })
    }else if(type=="not_equal"){
        return body(field).custom((value,{req})=>{
            if (req.body[check_field]===undefined || value === req.body[check_field]) {
                throw new Error(`'${field}' and '${check_field}' should have different value!`);
            }
            return true;
        })
    }
}
module.exports ={
    ID:ID,
    NAME:NAME,
    EXIST:EXIST,
    TEXT:TEXT,
    INT:INT,
    DATE:DATE,
    FLOAT:FLOAT,
    EQUALITY:EQUALITY,
    IN:IN,
    EMAIL:EMAIL,
    PASSWORD:PASSWORD
}
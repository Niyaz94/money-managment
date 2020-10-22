const user                 = require("../models/user");
const jwt                  = require("jsonwebtoken");

exports.login=function(req,res,next){
    console.log(process.env.DATABASE_NAME);
    user.findOne({where:{name:req.body.name}}).then(async find_user=>{
        if(find_user===null || !(await find_user.validPassword(req.body.password))){
            const error = new Error("The user Not found!!!");
            error.status =401;
            throw error;
        }
        const token=jwt.sign({
            "userId":find_user.id,
            "name":find_user.name,
            "email":find_user.email,
            "type":find_user.type
        },process.env.JWT,{expiresIn:'1h'});
        res.status(200).json({token:token,userId:find_user.id});
    }).catch(err=>next(err))
}
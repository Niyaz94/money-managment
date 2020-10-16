const user                 = require("../models/user");
const messages             = require("../util/message");

exports.getData=(req,res)=>{
    
}
exports.getAllData=function(req,res){
      
}
exports.insertData=async function(req,res,next){
    user.create({
        "name":req.body.name,
        "email":req.body.email,
        "password":req.body.password,
    }).then( result=>{        
        return messages.insert(res,1,result.id);
    }).catch(err=>next(err));
}
exports.updateData=async function(req,res){
    
}
exports.deleteData=async function(req,res){
    
}
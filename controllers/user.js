const user                 = require("../models/user");
const messages             = require("../util/message");

exports.getData=function(req,res,next){
    user.findByPk(req.params.id,{
        attributes: ['id','name','email','status','type',['created_at','datetime']]
    }).then(result=>{
        return res.status(result==null?400:200).json(result==null?{"response":"This row not found!!!"}:result);
    }).catch(err=>next(err))
}
exports.getAllData=function(req,res,next){    
    user.findAll({
        attributes: ['id','name','email','status','type',['created_at','datetime']]
    }).then(result=>{
        return res.status(200).json(result);
    }).catch(err=>next(err))
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
exports.updateData=async function(req,res,next){
    user.findByPk(req.params.id).then(updated_row=>{
        return updated_row.update({
            "name":req.body.name,
            "email":req.body.email,
            "password":req.body.password,
        });
    }).then(updated_row=>{
        return res.status(200).json({"response":"This data has been updated successfully!!!"});
    }).catch(err=>next(err));
}
exports.deleteData=async function(req,res,next){
    user.findByPk(req.params.id).then(deleted_row=>{
        return deleted_row.destroy();
    }).then(deleted_row=>{
        return res.status(200).json({"response":"This data has been deleted successfully!!!"});
    }).catch(err=>next(err));
}
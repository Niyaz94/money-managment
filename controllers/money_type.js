const moneyType = require("../models/moneyType");
const messages  = require("../util/message");

exports.getData=function(req,res){
    moneyType.findByPk(req.params.id,{
        attributes: ['id','name','created_at']
    }).then(result=>{
        return res.status(result==null?400:200).json(result==null?{"response":"This row not found!!!"}:result);
    }).catch(err=>{
        return res.status(400).json(err);
    }) 
}
exports.getAllData=function(req,res){
    moneyType.findAll({
        attributes: ['id','name',['created_at', 'created_at']]
    }).then(result=>{
        return res.status(200).json(result);
    }).catch(err=>{
        return res.status(400).json(err);
    }) 
}
exports.insertData=function(req,res){
    moneyType.create({
        "name":req.body.name
    }).then(result=>{
        return messages.insert(res,1,result.id);
    }).catch(err=>{
        return res.status(400).json({"response":err.errors[0].message});
    });
}
exports.updateData=function(req,res){
    moneyType.findByPk(req.params.id).then(moneyType=>{
        moneyType.name=req.body.name;
        return moneyType.save();
    }).then(update_result=>{
        return res.status(200).json({"response":"This data has been updated successfully!!!"});
    }).catch(err=>{
        return res.status(422).json({"response":err.errors[0].message});
    });
}
exports.deleteData=function(req,res){
    moneyType.findByPk(req.params.id).then(moneyType=>{
        return moneyType.destroy();
    }).then(deleted_result=>{
        return res.status(200).json({"response":"This data has been deleted successfully!!!"});
    }).catch(err=>{
        return res.status(400).json({"response":"The Data not found in the database!!!"});
    });
}
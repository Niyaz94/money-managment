const capitalType = require("../models/capitalType");
const messages    = require("../util/message");


exports.getData=function(req,res){
    capitalType.findOne({
        where:{id:req.params.id},
        attributes: ['id','name','note',['created_at','datetime']]
    }).then(result=>{
        return res.status(result==null?400:200).json(result==null?{"response":"This row not found!!!"}:result);
    }).catch(err=>{
        return res.status(400).json(err);
    })  
}
exports.getAllData=function(req,res){
    capitalType.findAll({
        attributes: ['id','name','note',['created_at','datetime']],
        where:{
            row_type:"dynamic"
        }
    }).then(result=>{
        return res.status(200).json(result);
    }).catch(err=>{
        return res.status(400).json(err);
    })  
}
exports.insertData=function(req,res){
    capitalType.create({
        "name":req.body.name,
        "transfer_type":req.body.transferType,
        "note":req.body.note
    }).then(result=>{
        return messages.insert(res,1,result.id);
    }).catch(err=>{
        return res.status(400).json({"response":err.errors[0].message});
    });
}
exports.updateData=function(req,res){
    capitalType.findByPk(req.params.id).then(capitalType=>{
        return capitalType.update({
            "name":req.body.name,
            "transfer_type":req.body.transferType,
            "note":req.body.note
        });
    }).then(update_result=>{
        return res.status(200).json({"response":"This data has been updated successfully!!!"});
    }).catch(err=>{
        return res.status(400).json({"response":err.errors[0].message});
    });
}
exports.deleteData=function(req,res){
    capitalType.findByPk(req.params.id).then(capitalType=>{
        return capitalType.destroy();
    }).then(deleted_result=>{
        return res.status(200).json({"response":"This data has been deleted successfully!!!"});
    }).catch(err=>{
        return res.status(400).json({"response":"The Data not found in the database!!!"});
    });
}
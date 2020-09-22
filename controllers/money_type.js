const moneyType= require("../models/moneyType");

exports.getData=function(req,res){
    moneyType.findByPk(req.params.id,{
        attributes: ['id','name','created_at']
    }).then(result=>{
        res.status(result==null?400:200).json(result==null?{"response":"This row not found!!!"}:result);
    }).catch(err=>{
        res.status(400).json(err);
    }) 
}
exports.getAllData=function(req,res){
    moneyType.findAll({
        attributes: ['id','name',['created_at', 'created_at']]
    }).then(result=>{
        res.status(200).json(result);
    }).catch(err=>{
        res.status(400).json(err);
    }) 
}
exports.insertData=function(req,res){
    moneyType.create({
        "name":req.body.name
    }).then(result=>{
        res.status(200).json({"response":`The new row has been added with id ${result.id}`});
    }).catch(err=>{
        res.status(400).json({"response":err.errors[0].message});
    });
}
exports.updateData=function(req,res){
    moneyType.findByPk(req.params.id).then(moneyType=>{
        if(moneyType==null){
            res.status(404).json({"response":"This id not found from our databases!"});
        }
        moneyType.name=req.body.name;
        return moneyType.save();
    }).then(update_result=>{
        res.status(200).json({"response":"This data has been updated successfully!!!"});
    }).catch(err=>{
        res.status(422).json({"response":err.errors[0].message});
    });
}
exports.deleteData=function(req,res){
    moneyType.findByPk(req.params.id).then(moneyType=>{
        if(moneyType==null){
            res.status(404).json({"response":"This id not found from our databases!"});
        }
        return moneyType.destroy();
    }).then(deleted_result=>{
        res.status(200).json({"response":"This data has been deleted successfully!!!"});
    }).catch(err=>{
        res.status(400).json({"response":"The Data not found in the database!!!"});
    });
}
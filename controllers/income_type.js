const incomeType=require("../models/incomeType");

exports.getData=function(req,res){
    incomeType.findByPk(req.params.id,{
        attributes: ['id','name','note',['created_at','datetime']]
    }).then(result=>{
        res.status(result==null?400:200).json(result==null?{"response":"This row not found!!!"}:result);
    }).catch(err=>{
        res.status(400).json(err);
    }) 
}
exports.getAllData=function(req,res){
    incomeType.findAll({
        attributes: ['id','name','note',['created_at','datetime']]
    }).then(result=>{
        res.status(200).json(result);
    }).catch(err=>{
        res.status(400).json(err);
    })  
}
exports.insertData=function(req,res){
    incomeType.create({
        "name":req.body.name,
        "note":req.body.note,
    }).then(result=>{
        res.status(200).json({"response":`The new row has been added with id ${result.id}`});
    }).catch(err=>{
        res.status(400).json({"response":err.errors[0].message});
    });
}
exports.updateData=function(req,res){
    incomeType.findByPk(req.params.id).then(incomeType=>{
        return incomeType.update({
            "name":req.body.name,
            "note":req.body.note,
        });
    }).then(update_result=>{
        res.status(200).json({"response":"This data has been updated successfully!!!"});
    }).catch(err=>{
        res.status(400).json({"response":err.errors[0].message});
    });
}
exports.deleteData=function(req,res){
    incomeType.findByPk(req.params.id).then(incomeType=>{
        return incomeType.destroy();
    }).then(deleted_result=>{
        res.status(200).json({"response":"This data has been deleted successfully!!!"});
    }).catch(err=>{
        res.status(400).json({"response":"The Data not found in the database!!!"});
    });
}
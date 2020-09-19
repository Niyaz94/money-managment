const incomeType=require("../models/incomeType");

exports.getData=function(req,res){
    if(isNaN(req.params.id) || req.params.id <1){
        res.status(400).json({"response":"The coming data uncorrect!!!"});
        return;
    }
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
    if (typeof req.body.name === 'undefined') {
        res.status(400).json({"response":"The request does not contain enough data to process!!!"});
        return;
    }else if(req.body.name.length<1){
        res.status(400).json({"response":"The name field is empty!!!"});
        return;
    } 
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
    if(isNaN(req.params.id) || req.params.id <1){
        res.status(400).json({"response":"The coming data uncorrect!!!"});
        return;
    }else if (typeof req.body.name === 'undefined') {
        res.status(400).json({"response":"The request does not contain enough data to process!!!"});
        return;
    }else if(req.body.name.length<1){
        res.status(400).json({"response":"The name field is empty!!!"});
        return;
    }

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
    if(isNaN(req.params.id) || req.params.id <1){
        res.status(400).json({"response":"The coming data uncorrect!!!"});
        return;
    }
    incomeType.findByPk(req.params.id).then(incomeType=>{
        return incomeType.destroy();
    }).then(deleted_result=>{
        res.status(200).json({"response":"This data has been deleted successfully!!!"});
    }).catch(err=>{
        res.status(400).json({"response":"The Data not found in the database!!!"});
    });
}
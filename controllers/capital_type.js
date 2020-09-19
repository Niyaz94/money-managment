const capitalType=require("../models/capitalType");

exports.getData=function(req,res){
    if(isNaN(req.params.id) || req.params.id <1){
        res.status(400).json({"response":"The coming data uncorrect!!!"});
        return;
    }
    capitalType.findOne({
        where:{id:req.params.id},
        attributes: ['id','name','note',['created_at','datetime']]
    }).then(result=>{
        res.status(result==null?400:200).json(result==null?{"response":"This row not found!!!"}:result);
    }).catch(err=>{
        res.status(400).json(err);
    })  
}
exports.getAllData=function(req,res){
    capitalType.findAll({
        attributes: ['id','name','note',['created_at','datetime']]
    }).then(result=>{
        res.status(200).json(result);
    }).catch(err=>{
        res.status(400).json(err);
    })  
}
exports.insertData=function(req,res){
    extra={};
    if (typeof req.body.name === 'undefined' || typeof req.body.transferType === 'undefined') {
        res.status(400).json({"response":"The request does not contain enough data to process!!!"});
        return;
    }else if(req.body.name.length<1){
        res.status(400).json({"response":"The name field is empty!!!"});
        return;
    }else if(!["push","pull"].includes(req.body.transferType)){
        res.status(400).json({"response":"The transferType field should be pull or push!!!"});
        return;
    }
    if(typeof req.body.rowType !== 'undefined'){
        if (!["static","dynamic"].includes(req.body.rowType)){
            res.status(400).json({"response":"The rowType field should be static or dynamic!!!"});
            return;
        }
        extra["row_type"]=req.body.rowType   
    }
    capitalType.create({
        "name":req.body.name,
        "transfer_type":req.body.transferType,
        "note":req.body.note,
        ...extra
    }).then(result=>{
        res.status(200).json({"response":`The new row has been added with id ${result.id}`});
    }).catch(err=>{
        res.status(400).json({"response":err.errors[0].message});
    });
}
exports.updateData=function(req,res){
    extra={};
    if(isNaN(req.params.id) || req.params.id <1){
        res.status(400).json({"response":"The coming data uncorrect!!!"});
        return;
    }else if (typeof req.body.name === 'undefined' || typeof req.body.transferType === 'undefined') {
        res.status(400).json({"response":"The request does not contain enough data to process!!!"});
        return;
    }else if(req.body.name.length<1){
        res.status(400).json({"response":"The name field is empty!!!"});
        return;
    }else if(!["push","pull"].includes(req.body.transferType)){
        res.status(400).json({"response":"The transferType field should be pull or push!!!"});
        return;
    }
    if(typeof req.body.rowType !== 'undefined'){
        if (!["static","dynamic"].includes(req.body.rowType)){
            res.status(400).json({"response":"The rowType field should be static or dynamic!!!"});
            return;
        }
        extra["row_type"]=req.body.rowType   
    }
    capitalType.findByPk(req.params.id).then(capitalType=>{
        return capitalType.update({
            "name":req.body.name,
            "transfer_type":req.body.transferType,
            "note":req.body.note,
            ...extra
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
    capitalType.findByPk(req.params.id).then(capitalType=>{
        return capitalType.destroy();
    }).then(deleted_result=>{
        res.status(200).json({"response":"This data has been deleted successfully!!!"});
        //res.status(200).json(deleted_result); it return all columns of deleted row
    }).catch(err=>{
        res.status(400).json({"response":"The Data not found in the database!!!"});
    });
}
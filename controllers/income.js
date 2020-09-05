const fs=require("fs");


exports.getData=function(req,res){
    res.status(200).json({"response":"The getData Request Done!!!"});
    return;
}

exports.insertData=function(req,res){
    res.status(200).json({"response":"The insertData Request Done!!!"});
    return;
}

exports.updateData=function(req,res){
    res.status(200).json({"response":"The updateData Request Done!!!"});
    return;
}

exports.deleteData=function(req,res){
    res.status(200).json({"response":"The deleteData Request Done!!!"});
    return;
}
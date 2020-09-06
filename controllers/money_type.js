const fs=require("fs");
const moment = require('moment');

const exec=require("../database/query").exec;


exports.getData=function(req,res){
    if(isNaN(req.params.id) || req.params.id <1){
        res.status(400).json({"response":"The coming data uncorrect!!!"});
        return;
    }
    const query='SELECT id,name FROM `money_type` where id=? and deleted_at is null';
    exec(query,[req.params.id])().then(function(results){
        res.status(200).json(results);
    }).catch(function(err){
        res.status(400).json("something wrong with database");
    })  
}

exports.getAllData=function(req,res){
    const query='SELECT id,name FROM `money_type` where deleted_at is null';
    exec(query,[])().then(function(results){
        res.status(200).json(results);
    }).catch(function(err){
        res.status(400).json("something wrong with database");
    })  
}

exports.insertData=function(req,res){

    res.send(req.file)
    return ;
    if (typeof req.body.name === 'undefined') {
        res.status(400).json({"response":"The request does not contain enough data to process!!!"});
        return;
    }else if(req.body.name.length<1){
        res.status(400).json({"response":"The name field is empty!!!"});
        return;
    }
    const query='INSERT INTO `money_type`(`name`, `created_at`) VALUES (?,?)';
    const value=[req.body.name,(moment().format("YYYY-MM-DD H:mm:ss"))];
    exec(query,value)().then(function(results){
        res.status(200).json({"response":`The new row has been added with id ${results.insertId}`});
    }).catch(function(err){
        res.status(400).send("something wrong with database");
    }) 
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
    const query='SELECT id FROM `money_type` where id=? and deleted_at is null';
    exec(query,[req.params.id])().then(function(results){
        if(results.length>0){
            const query='update `money_type` set `name`=? ,`updated_at`=? where id=?';
            const value=[req.body.name,(moment().format("YYYY-MM-DD H:mm:ss")),req.params.id];
            exec(query,value)().then(function(results){
                res.status(200).json({"response":"This data has been updated successfully!!!"});
            }).catch(function(err){
                res.status(400).json("something wrong with database");
            }) 
        }else{
            res.status(400).json({"response":"This data not found in the database!!!"});
        }
    }).catch(function(err){
        res.status(400).json("something wrong with database");
    })
}

exports.deleteData=function(req,res){
    if(isNaN(req.params.id) || req.params.id <1){
        res.status(400).json({"response":"The coming data uncorrect!!!"});
        return;
    }
    const query='SELECT id FROM `money_type` where id=? and deleted_at is null';
    exec(query,[req.params.id])().then(function(results){
        if(results.length>0){
            const query='update `money_type` set `deleted_at`=? where id=?';
            const value=[(moment().format("YYYY-MM-DD H:mm:ss")),req.params.id];
            exec(query,value)().then(function(results){
                res.status(200).json({"response":"This data has been deleted successfully!!!"});
            }).catch(function(err){
                res.status(400).json("something wrong with database");
            }) 
        }else{
            res.status(400).json({"response":"This data not found in the database!!!"});
        }
    }).catch(function(err){
        res.status(400).json("something wrong with database");
    })
}
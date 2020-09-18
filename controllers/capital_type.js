const moment = require('moment');


exports.getData=function(req,res){
    if(isNaN(req.params.id) || req.params.id <1){
        res.status(400).json({"response":"The coming data uncorrect!!!"});
        return;
    }
    const query='SELECT id,name,note,transfer_type FROM `capital_type` where id=? and deleted_at is null';
    exec(query,[req.params.id],1)().then(function(results){
        res.status(200).json(results);
    }).catch(function(err){
        res.status(400).send("something wrong with database");
    })  
}

exports.getAllData=function(req,res){
    const query='SELECT id,name,note,transfer_type FROM `capital_type` where deleted_at is null';
    exec(query,[])().then(function(results){
        res.status(200).json(results);
    }).catch(function(err){
        res.status(400).send("something wrong with database");
    })  
}

exports.insertData=function(req,res){
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
    const query='INSERT INTO `capital_type`(`name`,`transfer_type`,`note`,`created_at`) VALUES (?,?,?,?)';
    const value=[req.body.name,req.body.transferType,req.body.note,(moment().format("YYYY-MM-DD H:mm:ss"))];
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
    const query='SELECT count(`id`) as total FROM `capital_type` where id=? and deleted_at is null';
    
    exec(query,[req.params.id],2)().then(function(total){

        if(total==1){
            const query='update `capital_type` set `name`=? , `transfer_type`=?, `note`=?,`updated_at`=? where id=?';
            const value=[req.body.name,req.body.transferType,req.body.note,(moment().format("YYYY-MM-DD H:mm:ss")),req.params.id];
            exec(query,value)().then(function(results){
                res.status(200).json({"response":"This data has been updated successfully!!!"});
            }).catch(function(err){
                res.status(400).json("something wrong with database");
            }) 
        }else{
            res.status(400).json({"response":"This data not found in the database!!!"});
        }
    }).catch(function(err){
        res.status(400).send("something wrong with database");
    })
}

exports.deleteData=function(req,res){
    if(isNaN(req.params.id) || req.params.id <1){
        res.status(400).json({"response":"The coming data uncorrect!!!"});
        return;
    }
    const query='SELECT count(`id`) as total FROM `capital_type` where id=? and deleted_at is null';
    exec(query,[req.params.id],2)().then(function(total){
        if(total==1){
            const query='update `capital_type` set `deleted_at`=? where id=?';
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
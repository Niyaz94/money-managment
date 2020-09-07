const moment = require('moment');

const exec=require("../database/query").exec;
const check=require("../general/check");


exports.getData=function(req,res){
    res.status(200).json({"response":"The getData Request Done!!!"});
    return;
}

exports.insertData=async function(req,res){

    if (typeof req.body.date === 'undefined' || typeof req.body.amount === 'undefined' || typeof req.body.incomeTypeFid === 'undefined' || typeof req.body.moneyTypeFid === 'undefined') {
        res.status(400).json({"response":"The request does not contain enough data to process!!!"});
        return;
    }else if(!check.isDate(req.body.date)){
        res.status(400).json({"response":"The date field should has this format [ YYYY-MM-DD ] !!!"});
        return;
    }else if(isNaN(req.body.incomeTypeFid) || (await check.checkMoneyType(req.body.incomeTypeFid))!=1){
        res.status(400).json({"response":"The incomeTypeFid field should be number && exist in the Database !!!"});
        return;
    }else if(isNaN(req.body.moneyTypeFid) || (await check.checkMoneyType(req.body.moneyTypeFid))!=1){
        res.status(400).json({"response":"The moneyTypeFid field should be number && exist in the Database !!!"});
        return;
    }else if(isNaN(req.body.amount) || req.body.amount<=0){
        res.status(400).json({"response":"The amount field should be number && bigger than zero !!!"});
        return;
    }

    const query='INSERT INTO `income`(`money_type_fid`,`income_type_fid`,`amount`,`date`,`note`,`created_at`)VALUES(?,?,?,?,?,?)';
    const value=[
        req.body.moneyTypeFid,
        req.body.incomeTypeFid,
        req.body.amount,
        req.body.date,
        req.body.note,
        (moment().format("YYYY-MM-DD H:mm:ss"))
    ];
    exec(query,value)().then(function(results){

        const query='INSERT INTO `capital`(`capital_type_fid`,`money_type_fid`,`amount`,`date`,`note`,`created_at`)VALUES(?,?,?,?,?,?)';
        const value=[
            1,
            req.body.moneyTypeFid,
            req.body.amount,
            req.body.date,
            req.body.note,
            (moment().format("YYYY-MM-DD H:mm:ss"))
        ];
        exec(query,value)();
        res.status(200).json({"response":`The new row has been added with id ${results.insertId}`});
    }).catch(function(err){
        res.status(400).send("something wrong with database");
    }) 
}

exports.updateData=function(req,res){
    res.status(200).json({"response":"The updateData Request Done!!!"});
    return;
}

exports.deleteData=function(req,res){
    res.status(200).json({"response":"The deleteData Request Done!!!"});
    return;
}
const moment        = require("moment");

const income        = require("../models/income");
const capital       = require("../models/capital");
const incomeType    = require("../models/incomeType");
const moneyType     = require("../models/moneyType");

const check=require("../util/check");
const needs=require("../util/needs");
const capital_operations=require("../util/capital_operations");


const income_row=async (id=0)=>{
    const query=`
        SELECT
            income.id,
            money_type_fid,
            money_type.name as 'money_type',
            income_type.name as 'income_type',
            amount,
            date,
            income.note
        FROM
            income,
            money_type,
            income_type
        WHERE
            income.id=? AND
            income.deleted_at is null AND    
            money_type.deleted_at is null AND    
            income_type.deleted_at is null AND
            money_type.id=money_type_fid AND
            income_type.id=income_type_fid
    
    `;
    let data={};
    await exec(query,[id],1)().then(result=>{
        if(needs.is_set(result)){
            data=result;
        }
    }).catch(function(err){
    }) 
    return data;
}
exports.getData=(req,res)=>{
    if(isNaN(req.params.id) || req.params.id <1){
        res.status(400).json({"response":"The coming data uncorrect!!!"});
        return;
    }
    income.findByPk(req.params.id,{
        include:[
            {
                model:moneyType,
                attributes: ['id','name'],
                where:{},
                order:[]
            },
            {
                model:incomeType,
                attributes: ['id','name'],
                where:{},
                order:[]
            }
        ],
        attributes: ['id','amount','date','note',['created_at','datetime']]
    }).then(result=>{
        res.status(result==null?400:200).json(result==null?{"response":"This row not found!!!"}:result);
    }).catch(err=>{
        res.status(400).json(err);
    }) 
}
exports.getAllData=function(req,res){
    income.findAll({
        include:[
            {
                model:moneyType,
                attributes: ['id','name'],
                where:{},
                order:[]
            },
            {
                model:incomeType,
                attributes: ['id','name'],
                where:{},
                order:[]
            }
        ],
        attributes: ['id','amount','date','note',['created_at','datetime']]
    }).then(result=>{
        res.status(200).json(result);
    }).catch(err=>{
        res.status(400).json(err);
    })   
}
exports.insertData=async function(req,res){
    if (typeof req.body.date === 'undefined' || typeof req.body.amount === 'undefined' || typeof req.body.incomeTypeFid === 'undefined' || typeof req.body.moneyTypeFid === 'undefined') {
        res.status(400).json({"response":"The request does not contain enough data to process!!!"});
        return;
    }else if(!needs.isDate(req.body.date)){
        res.status(400).json({"response":"The date field should has this format [ YYYY-MM-DD ] !!!"});
        return;
    }else if(isNaN(req.body.incomeTypeFid) || (await check.checkIncomeType(req.body.incomeTypeFid))!=1){
        res.status(400).json({"response":"The incomeTypeFid field should be number && exist in the Database !!!"});
        return;
    }else if(isNaN(req.body.moneyTypeFid) || (await check.checkMoneyType(req.body.moneyTypeFid))!=1){
        res.status(400).json({"response":"The moneyTypeFid field should be number && exist in the Database !!!"});
        return;
    }else if(isNaN(req.body.amount) || req.body.amount<=0){
        res.status(400).json({"response":"The amount field should be number && bigger than zero !!!"});
        return;
    }
    income.create({
        "amount":req.body.amount,
        "date":req.body.date,
        "note":req.body.note
    }).then(new_income=>{
        new_income.setMoneyType(req.body.moneyTypeFid);
        new_income.setIncomeType(req.body.incomeTypeFid);
        capital.create({
            "amount":req.body.amount,
            "date":req.body.date,
            "note":req.body.note
        }).then(new_capital=>{
            new_capital.setMoneyType(req.body.moneyTypeFid);
            new_capital.setCapitalType(1);
        }).catch(err=>{
            res.status(400).json({"response":err.errors[0].message});
        });

        res.status(200).json({"response":`The new row has been added with id ${new_income.id}`});
    }).catch(err=>{
        res.status(400).json({"response":err.errors[0].message});
    });
}

exports.updateData=async function(req,res){

    if (typeof req.body.date === 'undefined' || typeof req.body.amount === 'undefined' || typeof req.body.incomeTypeFid === 'undefined' || typeof req.body.moneyTypeFid === 'undefined') {
        res.status(400).json({"response":"The request does not contain enough data to process!!!"});
        return;
    }else if(!needs.isDate(req.body.date)){
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
    }else if(isNaN(req.params.id) || req.params.id <1){
        res.status(400).json({"response":"The coming data uncorrect!!!"});
        return;
    }
    const {id=0,money_type_fid,money_type,amount,...others}=await income_row(req.params.id);
    
    if(id===0){
        res.status(400).json({"response":"There are no income with this id!!!"});
        return;
    }
    //if they are the same currency
    if(money_type_fid===req.body.moneyTypeFid){
        if((compare_amount=capital_operations.find_remain_money(amount,req.body.amount,"push"))>0 && !(await capital_operations.has_money_in_capital(compare_amount,money_type))){
            res.status(400).json({"response":"You can't do this operation, not enough money in the capital!!!"});
            return;
        }
        const compare_money=capital_operations.calculatte_remain_money(amount,req.body.amount,"income");
        if(compare_money[0]!=0){
            capital_operations.save_into_capital({capital_type_fid:compare_money[0],amount:compare_money[1],money_type_fid:money_type_fid});
        }
    }else{//if it is different currency
        if(!(await capital_operations.has_money_in_capital(amount,money_type))){
            res.status(400).json({"response":"You can't do this operation, not enough money in the capital!!!"});
            return;
        }
        // first  => pull the old money
        capital_operations.save_into_capital({capital_type_fid:2,amount:amount,money_type_fid:money_type_fid});
        // second => push the new money
        capital_operations.save_into_capital({capital_type_fid:1,amount:Number(req.body.amount),money_type_fid:req.body.moneyTypeFid});
    }
    const query=`
        UPDATE
            income
        SET
            money_type_fid =? ,
            income_type_fid =?,
            amount =?,
            date =?,
            note =?,
            updated_at = ?
        WHERE
            id=? AND
            deleted_at is null
    `;
    const value=[req.body.moneyTypeFid,req.body.incomeTypeFid,req.body.amount,req.body.date,req.body.note,(moment().format("YYYY-MM-DD H:mm:ss")),req.params.id];
    exec(query,value)().then(function(results){
        res.status(200).json({"response":"This data has been updated successfully!!!"});
    }).catch(function(err){
        res.status(400).json("something wrong with database");
    }) 
}
exports.deleteData=async function(req,res){
    if(isNaN(req.params.id) || req.params.id <1){
        res.status(400).json({"response":"The coming data uncorrect!!!"});
        return;
    }
    income.findByPk(req.params.id,{include :{model:moneyType,attributes: ['name']}}).then(async result=>{
        if(!(await capital_operations.has_money_in_capital(result.amount,result.moneyType.name))){
            res.status(400).json({"response":"You can't do this operation, not enough money in the capital!!!"});
        }else{
            capital.create({
                "amount":result.amount,
                "date":moment().format("YYYY-MM-DD"),
                "moneyTypeId":result.moneyTypeId,
                "capitalTypeId":2
            });
            result.destroy();
            res.status(200).json({"response":"This data has been deleted successfully!!!"});
        }
    }).catch(err=>{
        res.status(400).json({"response":"There are no income with this id!!!"});
    });
}
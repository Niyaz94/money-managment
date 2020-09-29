const moment        = require("moment");
const capital       = require("../models/capital");
const capitalType    = require("../models/capitalType");
const moneyType     = require("../models/moneyType");

const capital_operations=require("../util/capital_operations");

exports.getData=(req,res)=>{
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
    return res.end();
    /*income.create({
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
    });*/
}
exports.updateData=async function(req,res){
    try {
        previous_income=await income.findByPk(req.params.id,{include :{model:moneyType,attributes: ['id','name']}});
        //if they are the same currency
        if(previous_income.moneyTypeId===req.body.moneyTypeFid){
            if((compare_amount=capital_operations.find_remain_money(previous_income.amount,req.body.amount,"push"))>0 && !(await capital_operations.has_money_in_capital(compare_amount,previous_income.moneyType.id))){
                res.status(400).json({"response":"You can't do this operation, not enough money in the capital!!!"});
                return;
            }
            const compare_money=capital_operations.calculatte_remain_money(previous_income.amount,req.body.amount,"income");
            if(compare_money[0]!=0){
                capital.create({
                    "amount":compare_money[1],
                    "date":moment().format("YYYY-MM-DD"),
                    "moneyTypeId":previous_income.moneyTypeId,
                    "capitalTypeId":compare_money[0]
                });
            }
        }else{//if it is different currency
            if(!(await capital_operations.has_money_in_capital(previous_income.amount,previous_income.moneyType.id))){
                res.status(400).json({"response":"You can't do this operation, not enough money in the capital!!!"});
                return;
            }
            capital.bulkCreate([{
                "amount":previous_income.amount,
                "date":moment().format("YYYY-MM-DD"),
                "moneyTypeId":previous_income.moneyTypeId,
                "capitalTypeId":2
            },{
                "amount":Number(req.body.amount),
                "date":moment().format("YYYY-MM-DD"),
                "moneyTypeId":req.body.moneyTypeFid,
                "capitalTypeId":1
            }]);
        }
        try{
            await previous_income.update({
                "moneyTypeId":req.body.moneyTypeFid,
                "incomeTypeId":req.body.incomeTypeFid,
                "amount":req.body.amount,
                "date":req.body.date,
                "note":req.body.note
            });
            res.status(200).json({"response":"This data has been updated successfully!!!"});
        }catch(err){
            res.status(400).json("There is something wrong with updating income");
        }
    }catch(err){
        res.status(400).json({"response":"There is something wrong with check data!!!"});
    }
}
exports.deleteData=async function(req,res){
    income.findByPk(req.params.id,{include :{model:moneyType,attributes: ['id','name']}}).then(async result=>{
        if(!(await capital_operations.has_money_in_capital(result.amount,result.moneyType.id))){
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
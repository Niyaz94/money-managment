const moment                = require("moment");

const expense               = require("../models/expense");
const capital               = require("../models/capital");
const expenseType           = require("../models/expenseType");
const moneyType             = require("../models/moneyType");
const capital_operations    = require("../util/capital_operations");

exports.getData=(req,res)=>{
    expense.findByPk(req.params.id,{
        include:[
            {
                model:moneyType,
                attributes: ['id','name'],
                where:{},
                order:[]
            },
            {
                model:expenseType,
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
    expense.findAll({
        include:[
            {
                model:moneyType,
                attributes: ['id','name'],
                where:{},
                order:[]
            },
            {
                model:expenseType,
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
    if(!(await capital_operations.has_money_in_capital(req.body.amount,req.body.moneyTypeFid))){
        res.status(400).json({"response":"You can't do this operation, not enough money in the capital!!!"});
    }else{
        expense.create({
            "amount":req.body.amount,
            "date":req.body.date,
            "note":req.body.note
        }).then(new_expense=>{
            new_expense.setMoneyType(req.body.moneyTypeFid);
            new_expense.setExpenseType(req.body.expenseTypeFid);
            capital.create({
                "amount":req.body.amount,
                "date":req.body.date,
                "note":req.body.note
            }).then(new_capital=>{
                new_capital.setMoneyType(req.body.moneyTypeFid);
                new_capital.setCapitalType(2);
            }).catch(err=>{
                res.status(400).json({"response":err.errors[0].message});
            });
            res.status(200).json({"response":`The new row has been added with id ${new_expense.id}`});
        }).catch(err=>{
            res.status(400).json({"response":err.errors[0].message});
        });
    }
}
exports.updateData=async function(req,res){
    try {
        previous_expense=await expense.findByPk(req.params.id,{include :{model:moneyType,attributes: ['id','name']}});
        //if they are the same currency
        if(previous_expense.moneyTypeId===req.body.moneyTypeFid){
            if((compare_amount=capital_operations.find_remain_money(previous_expense.amount,req.body.amount,"pull"))>0 && !(await capital_operations.has_money_in_capital(compare_amount,previous_expense.moneyType.id))){
                res.status(400).json({"response":"You can't do this operation, not enough money in the capital!!!"});
                return;
            }
            const compare_money=capital_operations.calculatte_remain_money(previous_expense.amount,req.body.amount,"expense");
            if(compare_money[0]!=0){
                capital.create({
                    "amount":compare_money[1],
                    "date":moment().format("YYYY-MM-DD"),
                    "moneyTypeId":previous_expense.moneyTypeId,
                    "capitalTypeId":compare_money[0]
                });
            }
        }else{//if it is different currency
            if(!(await capital_operations.has_money_in_capital(req.body.amount,req.body.moneyTypeFid))){
                res.status(400).json({"response":"You can't do this operation, not enough money in the capital!!!"});
                return;
            }
            capital.bulkCreate([{
                "amount":previous_expense.amount,
                "date":moment().format("YYYY-MM-DD"),
                "moneyTypeId":previous_expense.moneyTypeId,
                "capitalTypeId":1
            },{
                "amount":Number(req.body.amount),
                "date":moment().format("YYYY-MM-DD"),
                "moneyTypeId":req.body.moneyTypeFid,
                "capitalTypeId":2
            }]);
        }
        try{
            await previous_expense.update({
                "moneyTypeId":req.body.moneyTypeFid,
                "expenseTypeId":req.body.expenseTypeFid,
                "amount":req.body.amount,
                "date":req.body.date,
                "note":req.body.note
            });
            res.status(200).json({"response":"This data has been updated successfully!!!"});
        }catch(err){
            res.status(400).json("There is something wrong with updating expense");
        }
    }catch(err){
        res.status(400).json({"response":"There is something wrong with check data!!!"});
    }
}
exports.deleteData=async function(req,res){
    expense.findByPk(req.params.id,{}).then(async result=>{
        capital.create({
            "amount":result.amount,
            "date":moment().format("YYYY-MM-DD"),
            "moneyTypeId":result.moneyTypeId,
            "capitalTypeId":1
        });
        result.destroy();
        res.status(200).json({"response":"This data has been deleted successfully!!!"});
    }).catch(err=>{
        res.status(400).json({"response":"There are no expense with this id!!!"});
    });
}
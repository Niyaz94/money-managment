const moment                = require("moment");
const expense               = require("../models/expense");
const capital               = require("../models/capital");
const expenseType           = require("../models/expenseType");
const moneyType             = require("../models/moneyType");
const messages              = require("../util/message");
const capitalCalculation    = require("../validation/calculation/capital").capitalCalculation;
const fs                    = require('fs');


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
        attributes: ['id','path','amount','date','note',['created_at','datetime']]
    }).then(result=>{
        return res.status(result==null?400:200).json(result==null?{"response":"This row not found!!!"}:result);
    }).catch(err=>{
        return res.status(400).json(err);
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
        attributes: ['id','path','amount','date','note',['created_at','datetime']]
    }).then(result=>{
        return res.status(200).json(result);
    }).catch(err=>{
        return res.status(400).json(err);
    })   
}
exports.insertData=async function(req,res){
    if(!(await new capitalCalculation().is_available(req.body.amount,req.body.moneyTypeFid))){
        try{
            fs.unlinkSync(`${req.file.path}`);
        }catch(err){
            console.log(err);
        }
        return res.status(400).json({"response":"You can't do this operation, not enough money in the capital!!!"});
    }else{
        const extra={};
        if(req.file !== undefined){
            extra["path"]=req.file.path;
        }
        expense.create({
            "amount":req.body.amount,
            "date":req.body.date,
            "note":req.body.note,
            ...extra
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
                return res.status(400).json({"response":err.errors[0].message});
            });
            return messages.insert(res,1,new_expense.id);
        }).catch(err=>{
            return res.status(400).json({"response":err});
        });
    }
}
exports.updateData=async function(req,res){
    try {
        previous_expense=await expense.findByPk(req.params.id,{include :{model:moneyType,attributes: ['id','name']}});
        //if they are the same currency
        if(previous_expense.moneyTypeId===req.body.moneyTypeFid){
            if((compare_amount=new capitalCalculation().findMoney(previous_expense.amount,req.body.amount,"pull"))>0 && !(await new capitalCalculation().is_available(compare_amount,previous_expense.moneyType.id))){
                try{
                    fs.unlinkSync(`${req.file.path}`);
                }catch(err){}
                return res.status(400).json({"response":"You can't do this operation, not enough money in the capital!!!"});
            }
            const compare_money=new capitalCalculation().calculatedMoney(previous_expense.amount,req.body.amount,"pull");
            if(compare_money[0]!="none"){
                capital.create({
                    "amount":compare_money[1],
                    "date":moment().format("YYYY-MM-DD"),
                    "moneyTypeId":previous_expense.moneyTypeId,
                    "capitalTypeId":(compare_money[0]=="pull"?2:1)
                });
            }
        }else{//if it is different currency
            if(!(await new capitalCalculation().is_available(req.body.amount,req.body.moneyTypeFid))){
                return res.status(400).json({"response":"You can't do this operation, not enough money in the capital!!!"});
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
            const extra={};
            if(req.file !== undefined){
                try{
                    fs.unlinkSync(`${previous_expense.path}`);
                }catch(err){
        
                }
                extra["path"]=req.file.path;
            }
            await previous_expense.update({
                "moneyTypeId":req.body.moneyTypeFid,
                "expenseTypeId":req.body.expenseTypeFid,
                "amount":req.body.amount,
                "date":req.body.date,
                "note":req.body.note,
                ...extra
            });
            return res.status(200).json({"response":"This data has been updated successfully!!!"});
        }catch(err){
            return res.status(400).json("There is something wrong with updating expense");
        }
    }catch(err){
        return res.status(400).json({"response":"There is something wrong with check data!!!"});
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
        try{
            fs.unlinkSync(`${result.path}`);
        }catch(err){

        }
        result.destroy();
        return res.status(200).json({"response":"This data has been deleted successfully!!!"});
    }).catch(err=>{
        return res.status(400).json({"response":"There are no expense with this id!!!"});
    });
}
const moment                = require("moment");
const messages              = require("../util/message");
const property              = require("../models/property");
const capital               = require("../models/capital");
const moneyType             = require("../models/moneyType");
const capitalCalculation    = require("../validation/rules/capital").capitalCalculation;


exports.getData=(req,res)=>{
    property.findByPk(req.params.id,{
        include:[
            {
                model:moneyType,
                attributes: ['id','name']
            }
        ],
        attributes: ['id','name','capitalAction','state','amount','date','note',['created_at','datetime']]
    }).then(result=>{
        return res.status(result==null?400:200).json(result==null?{"response":"This row not found!!!"}:result);
    }).catch(err=>{
        return res.status(400).json(err);
    }) 
}
exports.getAllData=function(req,res){
    property.findAll({
        include:[
            {
                model:moneyType,
                attributes: ['id','name']
            }
        ],
        attributes: ['id','name','capitalAction','state','amount','date','note',['created_at','datetime']]
    }).then(result=>{
        return res.status(200).json(result);
    }).catch(err=>{
        return res.status(400).json(err);
    })   
}
exports.insertData=async function(req,res){
    if(req.body.capitalAction=="yes"){
        if(!(await new capitalCalculation().is_available(req.body.amount,req.body.moneyTypeFid))){
            return res.status(400).json({"response":"You can't do this operation, not enough money in the capital!!!"});
        }else{
            capital.create({
                "amount":req.body.amount,
                "date":req.body.date,
                "note":req.body.note
            }).then(new_capital=>{
                new_capital.setMoneyType(req.body.moneyTypeFid);
                new_capital.setCapitalType(6);
            }).catch(err=>{
                return res.status(400).json({"response":err.errors[0].message});
            });
        }
    }
    property.create({
        "amount":req.body.amount,
        "date":req.body.date,
        "note":req.body.note,
        "state":req.body.state,
        "capitalAction":req.body.capitalAction,
        "name":req.body.name,
    }).then(new_property=>{
        new_property.setMoneyType(req.body.moneyTypeFid);
        return messages.insert(res,1,new_property.id);
    }).catch(err=>{
        return res.status(400).json({"response":err.errors[0].message});
    });
}
exports.updateData=async function(req,res){
    try {
        previous_property=await property.findByPk(req.params.id,{include :{model:moneyType,attributes: ['id','name']}});
        const result=await new capitalCalculation().property_update(req.params.id,req.body);
        if(!result["status"]){
            return res.status(400).json({"response":"You can't do this operation, not enough money in the capital!!!"});
        }else{
            result["rows"].map(row=>{
                capital.create({
                    "amount":row.amount,
                    "date":moment().format("YYYY-MM-DD"),
                    "moneyTypeId":row.moneyTypeId,
                    "capitalTypeId":row.capitalTypeId
                });
            })
            
        }
        try{
            await previous_property.update({
                "amount":req.body.amount,
                "date":req.body.date,
                "note":req.body.note,
                "state":req.body.state,
                "moneyTypeId":req.body.moneyTypeFid,
                "capitalAction":req.body.capitalAction,
                "name":req.body.name
            });
            return res.status(200).json({"response":"This data has been updated successfully!!!"});
        }catch(err){
            return res.status(400).json("There is something wrong with updating property");
        }
    }catch(err){
        return res.status(400).json({"response":"There is something wrong with check data!!!"});
    }
}
exports.deleteData=async function(req,res){
    property.findByPk(req.params.id,{}).then(async deleted_property=>{
        if(deleted_property.capitalAction=="yes"){
            capital.create({
                "amount":deleted_property.amount,
                "date":moment().format("YYYY-MM-DD"),
                "moneyTypeId":deleted_property.moneyTypeId,
                "capitalTypeId":5
            });
        }
        deleted_property.destroy().then(result=>{
            return res.status(200).json({"response":"This data has been deleted successfully!!!"});
        });
    }).catch(err=>{
        return res.status(400).json({"response":"There are no property with this id!!!"});
    });
}
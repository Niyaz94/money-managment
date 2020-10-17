const moment                = require("moment");
const exchange              = require("../models/exchange");
const capital               = require("../models/capital");
const moneyType             = require("../models/moneyType");
const messages              = require("../util/message");
const capitalCalculation    = require("../validation/rules/capital").capitalCalculation;
const needs                 = require("../util/needs");


exports.getData=(req,res,next)=>{
    exchange.findByPk(req.params.id,{
        include:[
            {
                model:moneyType,
                as:'sellMoneyType',
                attributes: ['id','name'],
                where:{},
                order:[]
            },
            {
                model:moneyType,
                attributes: ['id','name'],
                as:'buyMoneyType'
            }
        ],
        attributes: ['id','sellAmount','buyAmount','date','note','buyUrlPath','sellUrlPath',['created_at','datetime']]
    }).then(result=>{
        const {buyPath,sellPath,...new_result}=result.get({ plain: true});
        return res.status(new_result==null?400:200).json(new_result==null?{"response":"This row not found!!!"}:new_result);
    }).catch(err=>next(err)) 
}
exports.getAllData=function(req,res,next){
    exchange.findAll({
        //raw: true,
        include:[
            {
                model:moneyType,
                as:'sellMoneyType',
                attributes: ['id','name'],
                where:{},
                order:[]
            },
            {
                model:moneyType,
                as:'buyMoneyType',
                attributes: ['id','name'],
                where:{},
                order:[]
            }
        ],
        attributes:['id','sellAmount','buyAmount','date','note','buyUrlPath','sellUrlPath',['created_at','datetime']]   
    }).then(result=>{
        const new_result=result.map(item=>{
            const {buyPath,sellPath,...new_item}=item.get({ plain: true});
            return new_item;
        });
        return res.status(200).json(new_result);
    }).catch(err=>next(err))
}
exports.insertData=async function(req,res,next){
    if(!(await new capitalCalculation().is_available(req.body.sellAmount,req.body.sellMoneyTypeId))){
        needs.delete_image(req,true,false);
        const error = new Error("You can't do this operation, not enough money in the capital!!!");
        error.status =400;
        next(error);
    }else{
        const extra={};
        if(req.files !== undefined){
            if(req.files["buyImage"] !== undefined){
                extra["buyPath"]=req.files["buyImage"][0]["path"];
            }
            if(req.files["sellImage"] !== undefined){
                extra["sellPath"]=req.files["sellImage"][0]["path"];
            }
        }
        exchange.create({
            "sellAmount":req.body.sellAmount,
            "buyAmount":req.body.buyAmount,
            "date":req.body.date,
            "note":req.body.note,
            "buyMoneyTypeId":req.body.buyMoneyTypeId,
            "sellMoneyTypeId":req.body.sellMoneyTypeId,
            ...extra
        }).then(new_exchange=>{
            capital.create({
                "amount":req.body.buyAmount,
                "date":req.body.date,
                "note":req.body.note,
                "moneyTypeId":req.body.buyMoneyTypeId,
                "capitalTypeId":3
            });
            capital.create({
                "amount":req.body.sellAmount,
                "date":req.body.date,
                "note":req.body.note,
                "moneyTypeId":req.body.sellMoneyTypeId,
                "capitalTypeId":4
            })
            return messages.insert(res,1,new_exchange.id);
        }).catch(err=>next(err))
    }
}
exports.updateData=async function(req,res){  
    exchange.findByPk(req.params.id).then(async old_exchange=>{
        const result=await new capitalCalculation().exchange_update(req.params.id,req.body);
        if(!result["status"]){
            needs.delete_image(req,true,false);
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
        const extra={};
        const deleted_image=[];
        if(req.files !== undefined){
            if(req.files["buyImage"] !== undefined){
                deleted_image.push(old_exchange.buyPath);
                extra["buyPath"]=req.files["buyImage"][0]["path"];
            }
            if(req.files["sellImage"] !== undefined){
                deleted_image.push(old_exchange.sellPath);
                extra["sellPath"]=req.files["sellImage"][0]["path"];
            }
            if(deleted_image.length>0){
                needs.delete_old_image(deleted_image);
            }
        }
        return old_exchange.update({
            "buyMoneyTypeId":req.body.buyMoneyTypeId,
            "sellMoneyTypeId":req.body.sellMoneyTypeId,
            "sellAmount":req.body.sellAmount,
            "buyAmount":req.body.buyAmount,
            "date":req.body.date,
            "note":req.body.note,
            ...extra
        });
    }).then(edit_exchange=>{
        return res.status(200).json({"response":"This data has been updated successfully!!!"});
    }).catch(err=>{
        return res.status(400).json({"response":"The Data not found in the database!!!"});
    });
}
exports.deleteData=async function(req,res){
    exchange.findByPk(req.params.id).then(async old_exchange=>{
        if(!(await new capitalCalculation().is_available(old_exchange.buyAmount,old_exchange.buyMoneyTypeId))){
            return res.status(400).json({"response":"You can't do this operation, not enough money in the capital!!!"});
        }else{
            capital.bulkCreate([{
                "amount":old_exchange.sellAmount,
                "date":moment().format("YYYY-MM-DD"),
                "moneyTypeId":old_exchange.sellMoneyTypeId,
                "capitalTypeId":3
            },{
                "amount":old_exchange.buyAmount,
                "date":moment().format("YYYY-MM-DD"),
                "moneyTypeId":old_exchange.buyMoneyTypeId,
                "capitalTypeId":4
            }]);
        }
        needs.delete_old_image([old_exchange.buyPath,old_exchange.sellPath]);
        return old_exchange.destroy();
    }).then(deleted_exchange=>{
        return res.status(200).json({"response":"This data has been deleted successfully!!!"});
    }).catch(err=>{
        return res.status(400).json({"response":"The Data not found in the database!!!"});
    });
}
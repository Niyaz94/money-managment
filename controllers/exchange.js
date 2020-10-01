const moment                = require("moment");
const exchange              = require("../models/exchange");
const capital               = require("../models/capital");
const moneyType             = require("../models/moneyType");
const capitalCalculation    = require("../validation/calculation/capital").capitalCalculation;

exports.getData=(req,res)=>{
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
                as:'buyMoneyType',
                where:{},
                order:[]
            }
        ],
        attributes: ['id','sellAmount','buyAmount','date','note',['created_at','datetime']]
    }).then(result=>{
        res.status(result==null?400:200).json(result==null?{"response":"This row not found!!!"}:result);
    }).catch(err=>{
        res.status(400).json(err);
    }) 
}
exports.getAllData=function(req,res){
    exchange.findAll({
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
        attributes: ['id','sellAmount','buyAmount','date','note',['created_at','datetime']]
    }).then(result=>{
        res.status(200).json(result);
    }).catch(err=>{
        res.status(400).json(err);
    })   
}
exports.insertData=async function(req,res){
    if(!(await new capitalCalculation().is_available(req.body.sellAmount,req.body.sellMoneyTypeId))){
        res.status(400).json({"response":"You can't do this operation, not enough money in the capital!!!"});
    }else{
        exchange.create({
            "sellAmount":req.body.sellAmount,
            "buyAmount":req.body.buyAmount,
            "date":req.body.date,
            "note":req.body.note,
            "buyMoneyTypeId":req.body.buyMoneyTypeId,
            "sellMoneyTypeId":req.body.sellMoneyTypeId
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
            res.status(200).json({"response":`The new row has been added with id ${new_exchange.id}`});
        }).catch(err=>{
            res.status(400).json({"response":err.errors[0].message});
        });
    }
}
exports.updateData=async function(req,res){  
    exchange.findByPk(req.params.id).then(async old_exchange=>{
        if(!(await new capitalCalculation().exchange_update(req.params.id,req.body))){
            res.status(400).json({"response":"You can't do this operation, not enough money in the capital!!!"});
        }else{
            //capital.bulkCreate([{
            //    "amount":old_exchange.sellAmount,
            //    "date":moment().format("YYYY-MM-DD"),
            //    "moneyTypeId":old_exchange.sellMoneyTypeId,
            //    "capitalTypeId":3
            //},{
            //    "amount":old_exchange.buyAmount,
            //    "date":moment().format("YYYY-MM-DD"),
            //    "moneyTypeId":old_exchange.buyMoneyTypeId,
            //    "capitalTypeId":4
            //}]);
        }
        return old_exchange.update({

        });
    }).then(edit_exchange=>{
        res.status(200).json({"response":"This data has been updated successfully!!!"});
    }).catch(err=>{
        res.status(400).json({"response":"The Data not found in the database!!!"});
    });
}
exports.deleteData=async function(req,res){
    exchange.findByPk(req.params.id).then(async old_exchange=>{
        if(!(await new capitalCalculation().is_available(old_exchange.buyAmount,old_exchange.buyMoneyTypeId))){
            res.status(400).json({"response":"You can't do this operation, not enough money in the capital!!!"});
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
        return old_exchange.destroy();
    }).then(deleted_exchange=>{
        res.status(200).json({"response":"This data has been deleted successfully!!!"});
    }).catch(err=>{
        res.status(400).json({"response":"The Data not found in the database!!!"});
    });
}
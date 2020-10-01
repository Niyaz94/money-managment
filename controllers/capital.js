const capital       = require("../models/capital");
const capitalType   = require("../models/capitalType");
const moneyType     = require("../models/moneyType");
const capitalCalculation   = require("../validation/calculation/capital").capitalCalculation;

exports.getData=(req,res)=>{
    capital.findByPk(req.params.id,{
        include:[
            {
                model:moneyType,
                attributes: ['id','name'],
            },
            {
                model:capitalType,
                attributes: ['id','name'],
                where:{
                    row_type:"dynamic"
                }
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
    capital.findAll({
        include:[
            {
                model:moneyType,
                attributes: ['id','name'],
                where:{},
                order:[]
            },
            {
                model:capitalType,
                attributes: ['id','name'],
                where:{
                    row_type:"dynamic"
                },
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
    if(!(await new capitalCalculation(req.body.amount,req.body.moneyTypeFid,req.body.capitalTypeFid).insert())){
        res.status(422).json({"response":"You can't operate on static type or money not exist in capital"});
    }
    capital.create({
        "amount":req.body.amount,
        "date":req.body.date,
        "note":req.body.note
    }).then(new_capital=>{
        new_capital.setMoneyType(req.body.moneyTypeFid);
        new_capital.setCapitalType(req.body.capitalTypeFid);
        res.status(200).json({"response":`The new row has been added with id ${new_capital.id}`});
    }).catch(err=>{
        res.status(400).json({"response":err.errors[0].message});
    });
}
exports.updateData=async function(req,res){
    if(!(await new capitalCalculation(req.body.amount,req.body.moneyTypeFid,req.body.capitalTypeFid,req.params.id).update())){
        return res.status(422).json({"response":"You can't operate on static type or money not exist in capital"});
    }
    capital.update({
        "moneyTypeId":req.body.moneyTypeFid,
        "capitalTypeId":req.body.capitalTypeFid,
        "amount":req.body.amount,
        "date":req.body.date,
        "note":req.body.note
    },{where: {id:req.params.id}}).then(result=>{
        res.status(200).json({"response":"The row has been updated successfully!!!"});
    }).catch(err=>{
        res.status(400).json({"response":"Some thing wrong with updating data!!!"});
    });
}
exports.deleteData=async function(req,res){
    if(!(await new capitalCalculation(0,0,0,req.params.id).delete())){
        res.status(422).json({"response":"You can't operate on static type or money not exist in capital"});
    }
    capital.destroy({where: {id:req.params.id}}).then(async result=>{
        res.status(200).json({"response":"The row has been deleted successfully!!!"});
    }).catch(err=>{
        res.status(400).json({"response":"Some thing wrong with deleting data!!!"});
    });
}
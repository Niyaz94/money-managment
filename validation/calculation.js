const needs=require("../util/needs");
const extra=require("../models/extra");


const is_available=async (amount,money_type)=>{
    const data=await extra.current_total(money_type);
    if(!needs.is_set(data)){//if it is not object
        return false;
    }
    const {push:push_money=0,pull:pull_money=0}=data;
    return (Number(push_money)-Number(pull_money))>=Number(amount)?true:false;
}
module.exports={
    is_available:is_available
}
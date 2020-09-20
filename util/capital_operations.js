const needs=require("./needs");
const extra=require("../models/extra");


const has_money_in_capital=async (amount,money_type)=>{
    const data=await extra.current_total(money_type);
    if(!needs.is_set(data)){//if it is not object
        return false;
    }
    const {push:push_money=0,pull:pull_money=0,name=0}=data;
    return (Number(push_money)-Number(pull_money))>=Number(amount)?true:false;
}

const find_remain_money=(old_money,new_money,type)=>{
    if(type=="push" && old_money>new_money){//usually mean income
        return old_money-new_money;
    }else if(type=="pull" && old_money<new_money){//usually mean expense
        return new_money-old_money;
    }else{
        return 0;
    }
}
const calculatte_remain_money=(old_money,new_money,type)=>{
    if(type=="income"){//usually mean income
        if(old_money>new_money){
            return [2,(Number(old_money)-Number(new_money))];
        }else if(old_money<new_money){
            return [1,(Number(new_money)-Number(old_money))];
        }else{
            return [0,0];
        }
    }else if(type=="expense"){//usually mean expense
        if(old_money>=new_money){
            return [1,(Number(old_money)-Number(new_money))];
        }else if(old_money<new_money){
            return [2,(Number(new_money)-Number(old_money))];
        }else{
            return [0,0];
        }
    }
}

module.exports={
    has_money_in_capital:has_money_in_capital,
    find_remain_money:find_remain_money,
    calculatte_remain_money:calculatte_remain_money,
}
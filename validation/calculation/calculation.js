const needs=require("../../util/needs");
const extra=require("../../models/extra");

class calculation{
    async is_available (amount,money_type){
        const data=await extra.current_total(money_type);
        if(!needs.is_set(data)){//if it is not object
            return false;
        }
        const {push:push_money=0,pull:pull_money=0}=data;
        return (Number(push_money)-Number(pull_money))>=Number(amount)?true:false;
    }
    findMoney(old_money,new_money,type){
        old_money=Number(old_money);
        new_money=Number(new_money);
        if(type=="push" && old_money>new_money){//usually mean income
            return old_money-new_money;
        }else if(type=="pull" && old_money<new_money){//usually mean expense
            return new_money-old_money;
        }else{
            return 0;
        }
    }
    calculatedMoney(old_money,new_money,type){
        old_money=Number(old_money);
        new_money=Number(new_money);
        if(type=="push"){//usually mean income
            if(old_money>new_money){
                return ["pull",(old_money-new_money)];
            }else if(old_money<new_money){
                return ["push",(new_money-old_money)];
            }else{
                return ["none",0];
            }
        }else if(type=="pull"){//usually mean expense
            if(old_money>=new_money){
                return ["push",(old_money-new_money)];
            }else if(old_money<new_money){
                return ["pull",(new_money-old_money)];
            }else{
                return ["none",0];
            }
        }
    }
}
module.exports={
    calculation:calculation
}
const capitalType   = require("../../models/capitalType");
const capital       = require("../../models/capital");
const exchange      = require("../../models/exchange");
const calculation   = require("./calculation").calculation;


class capitalCalculation extends calculation {
    constructor(amount=0,moneyTypeId=0,capitalTypeId=0,id=0){
        super();
        this.amount=amount;
        this.moneyTypeId=moneyTypeId;
        this.capitalTypeId=capitalTypeId;
        this.id=id;
    }
    async insert(){
        const result=await capitalType.findOne({where:{id:this.capitalTypeId}});
        if(result.row_type=="static"){
            return false;
        }else if(result.transfer_type=="pull" && !(await this.is_available(this.amount,this.moneyTypeId))){
            return false;
        }else{
            return true;
        }
    }
    async update(){
        const old_capital =await capital.findByPk(this.id,{
            include:[{model:capitalType,attributes: ['transfer_type','row_type']}],
            attributes: ['amount','moneyTypeId']
        });
        const new_capitalType=await capitalType.findOne({where:{id:this.capitalTypeId}});
        if(old_capital.capitalType.row_type=="static"){
            return false;
        }else if(old_capital.capitalType.transfer_type=="pull" && new_capitalType.transfer_type=="pull"){
            if(old_capital.moneyTypeId!=this.moneyTypeId && !(await this.is_available(this.amount,this.moneyTypeId))){//if the currency are different
                return false;
            }else if(old_capital.moneyTypeId==this.moneyTypeId && Number(this.amount)>Number(old_capital.amount) && !(await this.is_available((Number(this.amount)-Number(old_capital.amount)),this.moneyTypeId))){                
                return false;
            }else{
                return true;
            }
        }else if(old_capital.capitalType.transfer_type=="pull" && new_capitalType.transfer_type=="push" ){
            // no need for checking
            return true;  
        }else if(old_capital.capitalType.transfer_type=="push" && new_capitalType.transfer_type=="pull" ){
            //check both old and new amount if they are exist in capital
            if(!(await this.is_available(old_capital.amount,old_capital.moneyTypeId)) || !(await this.is_available(this.amount,this.moneyTypeId))){
                return false;
            }else{
                return true;
            }
        }else if(old_capital.capitalType.transfer_type=="push" && new_capitalType.transfer_type=="push" ){
            if(old_capital.moneyTypeId!=this.moneyTypeId && !(await this.is_available(old_capital.amount,old_capital.moneyTypeId))){//if the currency are different
                return false;
            }else if(old_capital.moneyTypeId==this.moneyTypeId && Number(old_capital.amount)>Number(this.amount) && !(await this.is_available((Number(old_capital.amount)-Number(this.amount)),old_capital.moneyTypeId))){
                return false;
            }else{
                return true;
            } 
        }else{
            return true;
        }
    }
    async delete(){
        const old_capital =await capital.findByPk(this.id,{
            include:[{model:capitalType,attributes: ['transfer_type','row_type']}],
            attributes: ['amount','moneyTypeId']
        });
        if(old_capital.capitalType.row_type=="static"){
            return false;
        }else if(old_capital.capitalType.transfer_type=="push" && !(await this.is_available(old_capital.amount,old_capital.moneyTypeId))){
            return false;
        }else{
            return true;
        }
    }
    async exchange_update(row_id,new_exchange){
        const old_exchange=await exchange.findByPk(row_id);
        let result={status:true,rows:[]};
        if(old_exchange.sellMoneyTypeId==new_exchange.sellMoneyTypeId ){
            compare_amount=Number(new_exchange.sellAmount)-Number(old_exchange.sellAmount);
            if(compare_amount>0 && !(await this.is_available(compare_amount,new_exchange.sellMoneyTypeId))){
                return {status:false,rows:[]};
            }else{
                new_money=this.calculatedMoney(old_exchange.sellAmount,new_exchange.sellAmount,"pull");
                if(new_money!="none"){
                    result["rows"].push(addingToCapitalObject(new_money[1],(new_money[0]=="push"?3:4),new_exchange.sellMoneyTypeId));
                } 
            }
        }else if(old_exchange.sellMoneyTypeId!=new_exchange.sellMoneyTypeId){
            if(!(await this.is_available(Number(new_exchange.sellAmount),new_exchange.sellMoneyTypeId))){
                return {status:false,rows:[]};
            }else{
                result["rows"].push(addingToCapitalObject(old_exchange.sellAmount,3,old_exchange.sellMoneyTypeId));
                result["rows"].push(addingToCapitalObject(new_exchange.sellAmount,4,new_exchange.sellMoneyTypeId));
            }
        }
        if(old_exchange.buyMoneyTypeId==new_exchange.buyMoneyTypeId){
            compare_amount=Number(old_exchange.buyAmount)-Number(new_exchange.buyAmount);
            if(compare_amount>0 && !(await this.is_available(Number(compare_amount),old_exchange.buyMoneyTypeId))){
                return {status:false,rows:[]};
            }else{
                new_money=this.calculatedMoney(old_exchange.buyAmount,new_exchange.buyAmount,"push");
                if(new_money!="none"){
                    result["rows"].push(addingToCapitalObject(new_money[1],(new_money[0]=="push"?3:4),new_exchange.buyMoneyTypeId));
                }
            }
        }else if(old_exchange.buyMoneyTypeId!=new_exchange.buyMoneyTypeId){
            if(!(await this.is_available(Number(old_exchange.buyAmount),old_exchange.buyMoneyTypeId))){
                return {status:false,rows:[]};
            }else{
                result["rows"].push(addingToCapitalObject(old_exchange.buyAmount,4,old_exchange.buyMoneyTypeId));
                result["rows"].push(addingToCapitalObject(new_exchange.buyAmount,3,new_exchange.buyMoneyTypeId));
            }
        }
        return result;
    }
    addingToCapitalObject(amount,moneyTypeId,capitalTypeId){
        return {
            "amount":amount,
            "moneyTypeId":moneyTypeId,
            "capitalTypeId":capitalTypeId
        }
    }
}

module.exports= {
    capitalCalculation:capitalCalculation
}
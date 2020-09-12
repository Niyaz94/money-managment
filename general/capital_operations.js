const moment = require('moment');

const exec=require("../database/query").exec;
const needs=require("./needs");



const has_money_in_capital=async (amount,money_type)=>{
    const data=await current_total(money_type);

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

const current_total=async (row_type="all")=>{
    const query=`
        SELECT
        	money_type.name as name,
            SUM(
                IF(
                    transfer_type = 'push',
                    amount,
                    0
                )
            ) as push,
            SUM(
                IF(
                    transfer_type = 'pull',
                    amount,
                    0
                )
            ) as pull
        FROM
            capital,
            capital_type,
            money_type
        WHERE
            capital.deleted_at IS NULL AND 
            capital_type.deleted_at IS NULL AND 
            money_type.deleted_at IS NULL AND 
            capital_type.id = capital.capital_type_fid AND
            money_type.id = capital.money_type_fid
        GROUP BY
            money_type_fid
    `;
    let data=[];
    await exec(query,[])().then(result=>{
        data=row_type=="all"?result:result.filter(row=>row["name"]==row_type)[0];
    }).catch(function(err){
    }) 
    return data;
}

const save_into_capital=({capital_type_fid,money_type_fid,amount,date=(moment().format("YYYY-MM-DD")),note=''})=>{
        const query=`
            INSERT INTO capital(
                capital_type_fid,
                money_type_fid,
                amount,
                date,
                note,
                created_at
            )
            VALUES(?,?,?,?,?,?)
        `;
        exec(query,[capital_type_fid,money_type_fid,amount,date,note,moment().format("YYYY-MM-DD H:mm:ss")])(); 
}

module.exports={
    has_money_in_capital:has_money_in_capital,
    find_remain_money:find_remain_money,
    calculatte_remain_money:calculatte_remain_money,
    save_into_capital:save_into_capital
}
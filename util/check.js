


exports.checkMoneyType=async (money_type_id)=>{
    const query='SELECT count(*) as total FROM `money_type` where id=? and deleted_at is null';
    let result=0;
    await exec(query,[money_type_id],2)().then(total=>{
        result= total;
    }).catch(function(err){
        result= 0;
    }) 
    return result;
}

exports.checkIncomeType=async (income_type_id)=>{
    const query='SELECT count(*) as total FROM `income_type` where id=? and deleted_at is null';
    let result=0;
    await exec(query,[income_type_id],2)().then(total=>{
        result= total;
    }).catch(function(err){
        result= 0;
    }) 
    return result;
}




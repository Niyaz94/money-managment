const sequelize =require('../util/database');
const { QueryTypes } =require("sequelize");

module.exports.current_total=async (row_type="all")=>{
    row_type=row_type.toLowerCase();
    const query=`
        SELECT
        	moneyTypes.name as name,
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
            capitals,
            capitalTypes,
            moneyTypes
        WHERE
            capitals.deleted_at IS NULL AND 
            capitalTypes.deleted_at IS NULL AND 
            moneyTypes.deleted_at IS NULL AND 
            capitalTypes.id = capitals.capitalTypeId AND
            moneyTypes.id = capitals.moneyTypeId
        GROUP BY
            moneyTypeId
    `;
    let data=[];
    await sequelize.query(query,{
        type: QueryTypes.SELECT //without this line it is not working perfectly
    })
    .then(result=>{
        data=row_type=="all"?result:result.filter(row=>row["name"]==row_type)[0];
    }).catch(function(err){
    }) 
    return data;
}
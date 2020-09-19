const {Op}              =require("sequelize");

const moneyType         =require('../models/moneyType');
const incomeType        =require('../models/incomeType');

exports.checkMoneyType=async (money_type_id)=> await moneyType.count({where:{id:{[Op.eq]:money_type_id}}});
exports.checkIncomeType=async (income_type_id)=> await incomeType.count({where:{id:{[Op.eq]:income_type_id}}});
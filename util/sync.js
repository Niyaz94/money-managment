const sequelize         =require('./database');
const moneyType         =require('../models/moneyType');
const capitalType       =require('../models/capitalType');
const incomeType        =require('../models/incomeType');
const expenseType       =require('../models/expenseType');
const capital           =require('../models/capital');
const income            =require('../models/income');
const expense           =require('../models/expense');


module.exports=()=>{
    moneyType.hasOne(capital, {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
    capital.belongsTo(moneyType);
    capitalType.hasOne(capital, {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
    capital.belongsTo(capitalType);

    moneyType.hasOne(expense, {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
    expense.belongsTo(moneyType);
      
    expenseType.hasOne(expense, {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
    expense.belongsTo(expenseType);
      
    moneyType.hasOne(income, {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
    income.belongsTo(moneyType);
    
    incomeType.hasOne(income, {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
    income.belongsTo(incomeType);

      sequelize.sync(/*{ force: true }*/).then(result=>{
        //console.log(result);
      }).catch(err=>{
        console.log(err);
      });
      //capital.sync({ force: true });
}
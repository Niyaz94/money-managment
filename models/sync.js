const sequelize         = require('../util/database');
const moneyType         = require('./moneyType');
const capitalType       = require('./capitalType');
const incomeType        = require('./incomeType');
const expenseType       = require('./expenseType');
const capital           = require('./capital');
const income            = require('./income');
const exchange          = require('./exchange');
const expense           = require('./expense');
const property          = require('./property');
const user              = require('./user');

module.exports=()=>{

  moneyType.hasOne(exchange, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
    as:'buyMoneyType',
    foreignKey: {
      name: 'buyMoneyTypeId',
      allowNull: false
    }
  });
  exchange.belongsTo(moneyType,{
    as:'buyMoneyType',
    foreignKey: {
      name: 'buyMoneyTypeId',
      allowNull: false
    }
  });

  moneyType.hasOne(exchange, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
    as:'sellMoneyType',
    foreignKey: {
      name: 'sellMoneyTypeId',
      allowNull: false
    }
  });
  exchange.belongsTo(moneyType,{
    as:'sellMoneyType',
    foreignKey: {
      name: 'sellMoneyTypeId',
      allowNull: false
    }
  });

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

  moneyType.hasOne(property, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT'
  });
  property.belongsTo(moneyType);

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

  //MONEYTYPE.destroy({force: true//truncate : true,cascade: false});
  //exchange.sync({ force: true });
  //user.sync({ force: true });

  //moneyType.destroy({
  //  where: {},
  //  truncate: true
  //});


  //moneyType.sync({ 
  //  force: true,
  //  truncate : true, 
  //  cascade: false
  //});
}
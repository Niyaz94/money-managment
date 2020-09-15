const Sequelize = require('sequelize');

const sequelize =require('../util/database');
const MoneyType=sequelize.define('moneyType',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name:Sequelize.STRING
},{
    paranoid: true
});

module.exports= MoneyType;
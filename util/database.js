const { Sequelize, DataTypes } =require("sequelize");


const sequelize =new Sequelize(
    "money_management",
    "local_admin",
    "61#2d2A2j51^_4",
    {
        dialect:'mysql',
        host:'localhost'
    }
);

module.exports = sequelize; 
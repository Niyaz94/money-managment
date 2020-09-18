const { Sequelize, DataTypes } =require("sequelize");


const sequelize = new Sequelize(
    "money_management",
    "local_admin",
    "61#2d2A2j51^_4",
    {
        dialect:'mysql',
        host:'localhost',
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        logging:false,
        port:3306,
        timezone: '+03:00',
        dialectOptions: {//I don't know exactly what they are, but they fix read date from database
            dateStrings: true,
            typeCast: true
      },
    }
);

module.exports = sequelize; 
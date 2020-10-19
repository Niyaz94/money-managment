const { Sequelize } =require("sequelize");

const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASS,
    {
        dialect:'mysql',
        host:process.env.DATABASE_HOST,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        logging:false,
        port:process.env.DATABASE_PORT,
        timezone: '+03:00',
        dialectOptions: {//I don't know exactly what they are, but they fix read date from database
            dateStrings: true,
            typeCast: true
      },
    }
);
module.exports = sequelize; 
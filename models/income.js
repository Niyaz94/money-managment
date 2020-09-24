const { DataTypes } = require('sequelize');

const sequelize =require('../util/database');

const income=sequelize.define('income',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    amount:{
        type:DataTypes.DECIMAL(10,2).UNSIGNED,
        allowNull:false,
        defaultValue:0,
        validate:{
            notNull: true, 
            isNumeric: true,
            min: 0,             
            max: 1000000000  
        }
    },
    date: { 
        type: DataTypes.DATEONLY, 
        allowNull:false,
        defaultValue: DataTypes.NOW ,
        validate:{
            notNull: true, 
            isDate: true,      
            isAfter: "2018-01-01"        
        }
    },
    note: {
        type: DataTypes.TEXT,
        allowNull:true
    }
},{
    paranoid: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    indexes:[
    ]
});
module.exports= income;
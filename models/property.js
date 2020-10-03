const { DataTypes } = require('sequelize');

const sequelize =require('../util/database');

const expense=sequelize.define('property',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            len: [3,20],
            notNull: true,            // won't allow null
            notEmpty: true,           // don't allow empty strings
        }
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
    capitalAction: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['yes', 'no'],
        validate:{
            notNull: true,     
            notEmpty: true,
            isIn: [['yes', 'no']]
        }
    },
    state: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['own','sell', 'useless'],
        validate:{
            notNull: true,     
            notEmpty: true,
            isIn: [['own','sell', 'useless']]
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
module.exports= expense;
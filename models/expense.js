const { DataTypes } = require('sequelize');

const sequelize =require('../util/database');

const expense=sequelize.define('expense',{
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
    },
    path:{
        type: DataTypes.TEXT,
        allowNull:true,
        defaultValue: null,
        get: function (){// not use arrow function becuse it does not contain this object
            return "http://localhost:3000/"+this.getDataValue('path');
        },
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
const { DataTypes } = require('sequelize');

const sequelize =require('../util/database');

const exchange=sequelize.define('exchange',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    sellAmount:{
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
    buyAmount:{
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
    buyPath:{
        type: DataTypes.TEXT,
        allowNull:true,
        defaultValue: null,
        //get: function (){
        //    return "http://localhost:3000/"+this.getDataValue('buyPath');
        //}
    },
    sellPath:{
        type: DataTypes.TEXT,
        allowNull:true,
        defaultValue: null,
        //get: function (){
        //    return "http://localhost:3000/"+this.getDataValue('sellPath');
        //}
    },
    buyUrlPath: {
        type: DataTypes.VIRTUAL(DataTypes.STRING,["buyPath"]),
        get() {
            if(this.getDataValue('buyPath')===null){
                return "http://localhost:3000/uploads/general/error.jpg";
            }else{
                return "http://localhost:3000/"+this.getDataValue('buyPath');
            }
        }
    },
    sellUrlPath: {
        type: DataTypes.VIRTUAL(DataTypes.STRING,["sellPath"]),
        get () {
            if(this.getDataValue('sellPath')===null){
                return "http://localhost:3000/uploads/general/error.jpg";
            }else{
                return "http://localhost:3000/"+this.getDataValue('sellPath');
            }
        }
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
module.exports= exchange;
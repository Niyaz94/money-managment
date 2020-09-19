const { DataTypes } = require('sequelize');

const sequelize =require('../util/database');
const MoneyType=sequelize.define('moneyType',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
        unique: true,
        allowNull:false,
        get: function (){// not use arrow function becuse it does not contain this object
            return this.getDataValue('name').toUpperCase();
        },
        set(value) {
            this.setDataValue('name',value.toLowerCase());
        },
        validate:{
            len: [3,10],
            notNull: true,            // won't allow null
            notEmpty: true,           // don't allow empty strings
        }
      
    }

},{
    paranoid: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    indexes:[
        {
            name: 'money_type_index',
            fields: ['name']
        }
    ]
});

module.exports= MoneyType;
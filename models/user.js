const { DataTypes } = require('sequelize');
const sequelize     = require('../util/database');
const bcrypt        = require("bcrypt");

const user=sequelize.define('user',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING(50),
        allowNull:false,
        unique: true,
        validate:{
            len: { 
                args: [3,50],
                msg: "The name length should be between 3 and 20 characters."
            },  
            notNull: true,
        },
        
    },
    email:{
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'the email format not true!!!'
            },
            notNull: true
        },
        unique:true
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notNull: true,      
            notEmpty: true, 
            len: { 
                args: [8,20],
                msg: "The password length should be between 8 to 20 characters."
            }
        }
    },
    status: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['active', 'inactive'],
        defaultValue: "active",
        validate:{
            notNull: true,     
            notEmpty: true,
            isIn: [['active', 'inactive']]
        }
    },
    type: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['normal', 'admin','developer'],
        defaultValue: "normal",
        validate:{
            notNull: true,     
            notEmpty: true,
            isIn: [['normal', 'admin','developer']]
        }
    }
},{
    hooks : {
        beforeCreate : (user , options) => {
            user.password = user.password && user.password != "" ? bcrypt.hashSync(user.password, 12) : "";
        }
    },
    paranoid: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    indexes:[
    ]
});
//await user.validPassword("13456")
user.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}
module.exports= user;
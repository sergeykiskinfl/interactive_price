const Sequelize = require('sequelize');
const servimp = require('./../../Server.js');

const sequelize = servimp.sequelize;

const Model = Sequelize.Model;
class Category extends Model {}

Category.init({
    title: {
        type:Sequelize.STRING
    }
},
    {
        sequelize,
        modelname: 'Category',
        tableName: 'category',
        freezeTableName: true,
        timestamps: false 
    });

module.exports = Category;
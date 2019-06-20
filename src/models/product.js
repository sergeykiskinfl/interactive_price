const Sequelize = require('sequelize');
const servimp = require('./../../Server.js');

const sequelize = servimp.sequelize;

const Model = Sequelize.Model;
class Product extends Model {}

Product.init({
    id:{
        type: Sequelize.STRING,
        primaryKey: true
    },
    id_category: {
        type:Sequelize.INTEGER
    },
    id_vendor: {
        type:Sequelize.INTEGER
    },
    model: {
        type: Sequelize.STRING
    },
    cost: {
        type: Sequelize.DOUBLE
    },
},
    {
       sequelize,
       tableName: 'product',
       modelname: 'Product',
       freezeTableName: true,
       timestamps: false 
    });


module.exports = Product;
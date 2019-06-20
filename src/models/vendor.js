const Sequelize = require('sequelize');
const servimp = require('./../../Server.js');

const sequelize = servimp.sequelize;

const Model = Sequelize.Model;
class Vendor extends Model {}

Vendor.init({
    title: {
        type:Sequelize.STRING
    }
},
    {
        sequelize,
        modelname: 'Vendor',
        tableName: 'vendor',
        freezeTableName: true,
        timestamps: false 
    });

module.exports = Vendor;
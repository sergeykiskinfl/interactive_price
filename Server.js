/**
 * Логика промежуточного сервера (порт 3000)
 * Маршрутизация осуществляется с помощью Express
 * Запросы к PostgreSQL (5432) осуществляются с помощью Sequelize
 */

const express = require('express');
const cors = require('cors');

const Sequelize = require('sequelize');
const op = Sequelize.Op;

// Создание виртуальной базы данных
const sequelize = new Sequelize('YOUR_DATABASE', 'YOUR_USER', 'YOUR_PASSWORD', {
  host: 'localhost',
  dialect: 'postgres'
});

exports.sequelize = sequelize;

const product = require('./src/models/product.js');    
const category = require('./src/models/category.js');
const vendor = require('./src/models/vendor.js');

category.hasMany(product, { foreignKey: 'id_category' });
vendor.hasMany(product, { foreignKey: 'id_vendor' });

product.belongsTo(category,{ foreignKey: 'id_category' });
product.belongsTo(vendor,{ foreignKey: 'id_vendor' });

const modelObj = {

  category: category,

  vendor: vendor

};

// Логика маршрутизации
const app = express();
app.use(cors());
app.options('*', cors());

// Обработка запросов для первоначального отображения выпадающих списков
app.get('/kinds/:table', function(req, res){
  
  const table = modelObj[req.params.table];
  
  (async () => {
            
    const ressql = await table.findAll({
        
      attributes: ['id','title'],
        
    });
        
    res.json(ressql);
    
  })().catch(e => console.log(e.stack));

});

// Обработка запросов для получения необходимых данных
app.get('/product', function(req, res){
      
  (async () => {
            
    const items = await product.findAll({
      attributes: ['model','cost'],
      where: {
          cost:{[op.between]:req.query.cost}
      },
      include: [{
          model: category,
          where: { 
              title: {
              [op.any]:req.query.category
              }
          },
          attributes: ['title']
          },
          {
          model: vendor,
          where: {
              title: {
                  [op.any]:req.query.vendor    
              }
          },
          attributes: ['title']
          },
        ]
      })
          
      res.json(items);

  })().catch(e => console.log(e.stack));

});  

app.listen(3000);


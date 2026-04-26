'use strict';

// імпорти модулів 
const fs = require('fs'); // читати файли
const path = require('path'); // робота зі шляхами
const Sequelize = require('sequelize'); // створення ORM 
const process = require('process'); // env змінні
const basename = path.basename(__filename); // визначення поточного імені файлу
const env = process.env.NODE_ENV || 'development'; // визначення імені середовища
const config = require(__dirname + '/../config/config.json')[env]; // зчитування параметрів конфігурації
const db = {}; // збереження моделей (db.User, db.Orders...)

let sequelize; // створення підключення через env або стандартне підключення (база, клієнт, пароль)
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs // зчитування всіх файлів у папці models
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && // не приховані
      file !== basename && // не index.js
      file.slice(-3) === '.js' && // тільки .js
      file.indexOf('.test.js') === -1 // не тести
    );
  }) // підключення моделей (передача sequelize і DataTypes)
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });
// налаштування звʼязків між таблицями (проходження по таблицям і виклик associate)
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

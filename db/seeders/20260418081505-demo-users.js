'use strict';

const { faker } = require('@faker-js/faker'); // імпорт бібліотеки faker для заповнення даними

module.exports = { // експорт обʼєкта для Sequelize, він в собі має 2 методи (up, down)
  async up(queryInterface, Sequelize) {
    const users = [];

    for (let i = 0; i < 10; i++) {
      users.push({
        username: faker.internet.username(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: faker.helpers.arrayElement(['admin', 'client']),
        created_at: Math.floor(Date.now() / 1000),
      });
    }

    await queryInterface.bulkInsert('users', users); 
    // вставлення масиву даних users до таблиці users в БД
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
    // видалення масиву даних users з таблиці users в БД без фільтрації "where"
    // та додаткових налаштувань (транзакції, логування, truncate behavior)
  },
};
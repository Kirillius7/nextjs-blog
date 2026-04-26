'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface, Sequelize) {

    const [users] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE role = 'client'"
    );

    const [freeTickets] = await queryInterface.sequelize.query(
      "SELECT id FROM tickets WHERE status_ticket = 'available'"
    );

    if (!users.length || !freeTickets.length) return;

    const maxTicketsToSell = Math.floor(freeTickets.length * 0.6);

    let ticketIndex = 0; // індекс для руху по масиву квитків 

    while (ticketIndex < maxTicketsToSell) { // цикл працює доти, доки є вільні квитки

      const ticketsPerOrder = faker.number.int({ min: 1, max: 5 });

      const selectedTickets = freeTickets.slice(
        ticketIndex,
        ticketIndex + ticketsPerOrder
      ); 
      // підхід для розбиття квитків на групи для кожного замовлення 
      // (0,3) -> [1,2,3], (3,5) -> [4,5] з проходженням індексу
      // підхід такий, що навіть якщо рандомного числа для кількості квитків не вистачить,
      // то система просто вилучить зайві квитки (6,10) -> [7,8]

      if (selectedTickets.length === 0) break;

      ticketIndex += selectedTickets.length;

      const ticketIds = selectedTickets.map(t => t.id);

      await queryInterface.bulkInsert('orders', [{
        user_id: faker.helpers.arrayElement(users).id,
        status_order: 'paid',
        created_at: Math.floor(Date.now() / 1000)
      }]);

      // процес вилучення id останнього order
      const [[order]] = await queryInterface.sequelize.query(
        "SELECT id, user_id FROM orders ORDER BY id DESC LIMIT 1"
      );

      // оновлення статусу і айді користувача, що придбав квитки
      // user_id: order.user_id
      await queryInterface.bulkUpdate(
        'tickets',
        {
          status_ticket: 'sold',
          order_id: order.id,
          user_id: order.user_id
        },
        {
          id: ticketIds // принцип оновлення where id in (... , ... , ...)
        }
      );
    }

    const [paidOrders] = await queryInterface.sequelize.query(
      "SELECT id FROM orders WHERE status_order = 'paid'"
    );

    for (const order of paidOrders) {
      await queryInterface.bulkUpdate(
        'orders',
        {
          published_at: Math.floor(Date.now() / 1000),
        },
        {
          id: order.id
        }
      );
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('orders', null, {});

    await queryInterface.bulkUpdate(
      'tickets',
      {
        status_ticket: 'available',
        order_id: null
      },
      {}
    );
  }
};
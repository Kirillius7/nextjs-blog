'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface, Sequelize) {
    const [events] = await queryInterface.sequelize.query(
      "SELECT id, location_capacity FROM events where status_event = 'active'"
    );

    const tickets = [];

    for (const event of events) {
      const capacity = event.location_capacity;
        
      for (let i = 0; i < capacity; i++) {

        const rand = Math.random();

        let category;
        if (rand < 0.7) category = 'ordinary';
        else if (rand < 0.9) category = 'special';
        else category = 'vip';

        let price;
        switch (category) {
          case 'vip':
            price = faker.number.int({ min: 150, max: 300 });
            break;
          case 'special':
            price = faker.number.int({ min: 80, max: 150 });
            break;
          default:
            price = faker.number.int({ min: 20, max: 80 });
        }

        tickets.push({
          event_id: event.id,
          order_id: null,
          user_id: null,
          price_per_ticket: price,
          status_ticket: 'available',
          category
        });
      }
    }

    await queryInterface.bulkInsert('tickets', tickets);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tickets', null, {});
  }
};
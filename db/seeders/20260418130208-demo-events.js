'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface, Sequelize) {
    const [admins] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE role = 'admin'"
    );
    const [series] = await queryInterface.sequelize.query(
      "SELECT id FROM event_series"
    );  
    const events = []
    for(let i = 0; i < 10; i++){
      const startDate = faker.date.future();

      const startUnix = Math.floor(startDate.getTime() / 1000);

      const endDate = new Date(
        startDate.getTime() +
        faker.number.int({ min: 2, max: 8 }) * 60 * 60 * 1000
      );

      const endUnix = Math.floor(endDate.getTime() / 1000);
        
      events.push({
        user_id: faker.helpers.arrayElement(admins).id,
        series_id: faker.helpers.arrayElement(series).id,
        location_name: faker.location.city(),
        location_address: faker.location.streetAddress({useFullAddress: true}),
        location_capacity: faker.number.int({min: 1, max: 20}),
        start_date: startUnix,
        end_date: endUnix,
        status_event: faker.helpers.arrayElement(['active', 'postponed', 'cancelled', 'draft']),
        created_at: Math.floor(Date.now() / 1000)
      }) 
    }
      
    await queryInterface.bulkInsert('events', events);

    const [activeEvents] = await queryInterface.sequelize.query(
      "SELECT id FROM events WHERE status_event = 'active'"
    );

    for (const event of activeEvents) {
      await queryInterface.bulkUpdate(
        'events',
        {
          published_at: Math.floor(Date.now() / 1000),
        },
        {
          id: event.id
        }
      );
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('events', null, {});
  }
};
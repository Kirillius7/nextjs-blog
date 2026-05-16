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
    for(let i = 0; i < 1000; i++){
      const startDate = faker.date.future();

      const startUnix = Math.floor(startDate.getTime() / 1000);
      // метод повертає дату в мілісекундах, але unix timestamp стандартний у секундах (тому треба поділити на 1000)

      const endDate = new Date(
        startDate.getTime() +
        faker.number.int({ min: 2, max: 8 }) * 60 * 60 * 1000 
        // Date працює у мілісекундах, тому треба перевести в секунду як одиницю вимірювання
        // а вже в базі даних система конвертує у залежності до типу даних (час та дата)
      );

      const endUnix = Math.floor(endDate.getTime() / 1000);
        
      events.push({
        user_id: faker.helpers.arrayElement(admins).id,
        series_id: faker.helpers.arrayElement(series).id,
        event_name: faker.company.name(),
        location_name: faker.location.city(),
        location_address: faker.location.streetAddress({useFullAddress: true}),
        location_capacity: faker.number.int({min: 1, max: 20}),
        start_date: startUnix,
        end_date: endUnix,
        //status_event: faker.helpers.arrayElement(['active', 'postponed', 'cancelled', 'draft']),
        status_event: faker.helpers.arrayElement(['active', 'postponed']),
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
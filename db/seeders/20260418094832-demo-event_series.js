'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface, Sequelize) {
    const eventSeries = [];

    const audienceTypes = ['general', 'youth', 'adult', 'professional', 'niche'];
    const venueTypes = ['indoor', 'outdoor', 'mixed'];
    const scales = ['local', 'regional', 'international', 'global'];

    for (let i = 0; i < 10; i++) {
      eventSeries.push({
        name: faker.company.name(),
        description: faker.lorem.paragraph(),
        audience_type: faker.helpers.arrayElement(audienceTypes),
        venue_type: faker.helpers.arrayElement(venueTypes),
        scale: faker.helpers.arrayElement(scales),
      });
    }

    await queryInterface.bulkInsert('event_series', eventSeries);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('event_series', null, {});
  },
};
'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface, Sequelize) {
    const [events] = await queryInterface.sequelize.query(
      "SELECT id, start_date, end_date FROM events WHERE status_event = 'active'"
    );

    const [artists] = await queryInterface.sequelize.query(
      "SELECT id FROM artists"
    );

    const eventArtists = [];

    // обробка кожної події, у якої статус є "активний"
    for (const event of events) {
      const eventStart = new Date(event.start_date * 1000);
      const eventEnd = new Date(event.end_date * 1000);

      const durationMs = eventEnd - eventStart;

      // випадкове визначення кількості артистів на одну подію
      const artistCount = faker.number.int({ min: 2, max: 5 });

      const selectedArtists = faker.helpers.arrayElements(
        artists,
        artistCount
      ); // визначення артистів на основі випадкового числа їхньої кількості на події

      for (let i = 0; i < selectedArtists.length; i++) {
        const progress = (i + 1) / (selectedArtists.length + 1);
        // розподіл часу події на певну кількість виконавців
        // (0+1)/(3+1)... 25%, 50%, 75% часу від події
        const randomOffset = faker.number.int({
          min: -15 * 60 * 1000,
          max: 15 * 60 * 1000
        }); // зміщення часу в розкладі в межах 15 хвилин 

        const performanceTime = new Date(
          eventStart.getTime() + durationMs * progress + randomOffset
        );

        const performanceUnix = Math.floor(performanceTime.getTime() / 1000);

        eventArtists.push({
          event_id: event.id,
          artist_id: selectedArtists[i].id, 
          // асигнування виконавця за індексом масива до певної за айді події
          performance_time: performanceUnix
        });
      }
    }

    try {
      await queryInterface.bulkInsert('event_artists', eventArtists);
    } catch (err) {
      console.error(err);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('event_artists', null, {});
  }
};
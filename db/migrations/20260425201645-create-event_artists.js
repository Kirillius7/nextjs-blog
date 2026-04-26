'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    const statement = `CREATE TABLE event_artists (
      event_id int NOT NULL,
      artist_id int NOT NULL,
      performance_time bigint DEFAULT NULL,
      PRIMARY KEY (event_id, artist_id),
      KEY event_artists_ibfk_2 (artist_id),
      CONSTRAINT event_artists_ibfk_1 FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE,
      CONSTRAINT event_artists_ibfk_2 FOREIGN KEY (artist_id) REFERENCES artists (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`
     await queryInterface.sequelize.query(statement)
  },

  async down (queryInterface) {
    const statement = `DROP TABLE event_artists`
    await queryInterface.sequelize.query(statement)
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    const statement = `CREATE TABLE event_series (
      id int NOT NULL AUTO_INCREMENT,
      name varchar(255) NOT NULL,
      description text,
      audience_type enum('general','youth','adult','professional','niche') NOT NULL DEFAULT 'general',
      venue_type enum('indoor','outdoor','mixed') NOT NULL DEFAULT 'outdoor',
      scale enum('local','regional','international','global') NOT NULL DEFAULT 'global',
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`
     await queryInterface.sequelize.query(statement)
  },

  async down (queryInterface) {
    const statement = `DROP TABLE event_series`
    await queryInterface.sequelize.query(statement)
  }
};

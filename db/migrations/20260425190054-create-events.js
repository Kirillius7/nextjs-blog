'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    const statement = `CREATE TABLE events (
      id int NOT NULL AUTO_INCREMENT,
      user_id int DEFAULT NULL,
      series_id int DEFAULT NULL,
      location_name varchar(255) NOT NULL,
      location_address varchar(255) NOT NULL,
      location_capacity int NOT NULL,
      start_date bigint DEFAULT NULL,
      end_date bigint DEFAULT NULL,
      status_event enum('active','postponed','cancelled','draft') NOT NULL DEFAULT 'draft',
      created_at bigint NOT NULL,
      published_at bigint DEFAULT NULL,
      PRIMARY KEY (id),
      KEY idx_user_id (user_id),
      KEY idx_series_id (series_id),
      KEY idx_events_status_date (status_event,start_date),
      CONSTRAINT events_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
      CONSTRAINT events_ibfk_2 FOREIGN KEY (series_id) REFERENCES event_series (id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`
     await queryInterface.sequelize.query(statement)
  },

  async down (queryInterface) {
    const statement = `DROP TABLE events`
    await queryInterface.sequelize.query(statement)
  }
};

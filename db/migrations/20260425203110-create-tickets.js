'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    const statement = `CREATE TABLE tickets (
      id int NOT NULL AUTO_INCREMENT,
      order_id int DEFAULT NULL,
      event_id int NOT NULL,
      user_id int DEFAULT NULL,
      price_per_ticket decimal(10,2) NOT NULL,
      status_ticket enum('available','sold','returned') NOT NULL DEFAULT 'available',
      category enum('ordinary','special','vip') NOT NULL DEFAULT 'ordinary',
      PRIMARY KEY (id),
      KEY order_id (order_id),
      KEY idx_tickets_event_status (event_id,status_ticket),
      KEY idx_tickets_user_status (user_id,status_ticket),
      CONSTRAINT tickets_ibfk_1 FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE SET NULL,
      CONSTRAINT tickets_ibfk_2 FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE RESTRICT,
      CONSTRAINT tickets_ibfk_3 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`
     await queryInterface.sequelize.query(statement)
  },

  async down (queryInterface) {
    const statement = `DROP TABLE tickets`
    await queryInterface.sequelize.query(statement)
  }
};

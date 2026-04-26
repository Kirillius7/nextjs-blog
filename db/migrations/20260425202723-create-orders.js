'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    const statement = `CREATE TABLE orders (
      id int NOT NULL AUTO_INCREMENT,
      user_id int NOT NULL,
      status_order enum('pending','paid','cancelled') NOT NULL DEFAULT 'pending',
      created_at bigint NOT NULL,
      published_at bigint DEFAULT NULL,
      PRIMARY KEY (id),
      KEY idx_orders_user_status (user_id,status_order),
      CONSTRAINT orders_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE RESTRICT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`
     await queryInterface.sequelize.query(statement)
  },

  async down (queryInterface) {
    const statement = `DROP TABLE orders`
    await queryInterface.sequelize.query(statement)
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    const statement = `CREATE TABLE users (
      id int NOT NULL AUTO_INCREMENT,
      username varchar(255) NOT NULL,
      email varchar(255) NOT NULL,
      password varchar(255) NOT NULL,
      role enum('admin','client') NOT NULL,
      created_at bigint NOT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY email_unique (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`
     await queryInterface.sequelize.query(statement)
  },

  async down (queryInterface) {
    const statement = `DROP TABLE users`
    await queryInterface.sequelize.query(statement)
  }
};

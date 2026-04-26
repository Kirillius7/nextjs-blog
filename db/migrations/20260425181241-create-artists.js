'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    const statement = `CREATE TABLE artists (
      id int NOT NULL AUTO_INCREMENT,
      stage_name varchar(255) NOT NULL,
      first_name varchar(255) DEFAULT NULL,
      second_name varchar(255) DEFAULT NULL,
      genre varchar(255) DEFAULT NULL,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`
     await queryInterface.sequelize.query(statement)
  },

  async down (queryInterface) {
    const statement = `DROP TABLE artists`
    await queryInterface.sequelize.query(statement)
  }
};

'use strict';

const { faker } = require('@faker-js/faker');


module.exports = {
  async up(queryInterface, Sequelize) {
    const artists = []
    for(let i = 0; i < 10; i++){
      artists.push({
        stage_name: faker.music.artist(),
        first_name: faker.person.firstName(),
        second_name: faker.person.lastName(),
        genre: faker.music.genre()
      }) 
    }
      
    await queryInterface.bulkInsert('artists', artists);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('artists', null, {});
  }
};
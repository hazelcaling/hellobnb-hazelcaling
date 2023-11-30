'use strict';

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    const spots = [];
    for (let i = 1; i < 4; i++) {
      spots.push({
        // ownerId: i,
        address: `${i} Street`,
        city: `city${i}`,
        state: `state${i}`,
        country: 'United States',
        lat: i+10,
        lng: i+11,
        name: `name${i}`,
        description: `description${i}`,
        price: i+100,
        avgRating: i+2,
        previewImage: true
      })
    }
    await Spot.bulkCreate(spots, { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};

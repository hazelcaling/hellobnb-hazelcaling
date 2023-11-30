'use strict';

const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    const reviews = [];
    for (let i = 1; i < 4; i++) {
      reviews.push({
        // userId: i,
        // spotId: i,
        review: `This is review ${i}`,
        stars: i+1
      })
    }
    await Review.bulkCreate(reviews, { validate: true })

  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1,2,3] }
    }, {});

  }
};

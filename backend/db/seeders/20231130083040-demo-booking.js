'use strict';

const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    const bookings = [];
    for (let i = 1; i < 3; i++) {
      bookings.push({
        // userId: i,
        // spotId: i,
        startDate: new Date(),
        endDate: new Date()
      });
    }
    await Booking.bulkCreate(bookings, { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};

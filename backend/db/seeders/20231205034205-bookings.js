'use strict';

const { Spot, User, Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    const user = await User.findOne({where: {username: 'Demo-lition'}});
    const spot = await Spot.findOne({where: {address: '1 Street'}})
    await Booking.bulkCreate([
      {
        userId: user.id,
        spotId: spot.id,
        startDate: '2023-12-15',
        endDate: '2023-12-30'
      }
    ])

  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      startDate: { [Op.in]: ['2023-12-15'] }
    }, {});

  }
};

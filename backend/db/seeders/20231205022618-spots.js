'use strict';

const { Spot, User } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    const user = await User.findOne({where: {username: 'Demo-lition'}})
    await Spot.bulkCreate([
      {
        ownerId: user.id,
        address: '1 Street',
        city: 'San Francisco',
        state: 'CA',
        country: 'United States',
        lat: 1,
        lng: 1,
        name: 'Name1',
        description: 'Description1',
        price: 100
      }
    ], { validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: { [Op.in]: ['1 Street'] }
    }, {});
  }
};

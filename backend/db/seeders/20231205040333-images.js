'use strict';

const { Spot, Image } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    const spot = await Spot.findOne({where:{address: '1 Street'}})
    await Image.bulkCreate([
      {
        imageableId: spot.id,
        imageableType: 'Spot',
        url: '../images/doraemonHouse.png',
        preview: false
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    const spot = await Spot.findOne({where:{address: '1 Street'}})
    options.tableName = 'Images';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      imageableId: { [Op.in]: [spot.id] }
    }, {});
  }
};

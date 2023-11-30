'use strict';

const { Image } = require('../models');
const fs = require('fs');
const path = require('path')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {

    const images = [];
    for (let i = 1; i < 4; i++) {
      images.push({
        imageableId: i,
        imageableType: `Model${i}`,
        url: `image${i}`,
        preview: false
      });
    }
    await Image.bulkCreate(images, { validate: true })

  },

  // imageableId: DataTypes.INTEGER,
  //   imageableType: DataTypes.STRING,
  //   url: DataTypes.STRING,
  //   preview: DataTypes.BOOLEAN

  async down (queryInterface, Sequelize) {
    options.tableName = 'Images';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      imageableId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};

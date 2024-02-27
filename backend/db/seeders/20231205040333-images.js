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
        url: 'https://cdn.dribbble.com/users/3696949/screenshots/16744887/nobita_s_house_4x.png',
        preview: true
      },
      {
        imageableId: spot.id,
        imageableType: 'Spot',
        url: 'https://3.bp.blogspot.com/-s9q7Nafe3hA/WJlu-jUz8ZI/AAAAAAAABSQ/Zyz1OEbuw18ROvgE1ZebDx7Eb-4gRsyYQCLcB/s1600/Modern%2BBahay%2BKubo%2BKahit%2BMunti_Nipa%2BHut%2B%25285%2529.jpg',
        preview: true
      },
      {
        imageableId: spot.id,
        imageableType: 'Spot',
        url: 'https://sa.kapamilya.com/absnews/abscbnnews/media/ancx/culture/2021/36/1mikko.jpg',
        preview: true
      },

      {
        imageableId: spot.id,
        imageableType: 'Spot',
        url: 'https://sa.kapamilya.com/absnews/abscbnnews/media/ancx/culture/2021/36/3mikko.jpg',
        preview: true
      },
      {
        imageableId: spot.id,
        imageableType: 'Spot',
        url: 'https://i.ytimg.com/vi/EomANw652qQ/maxresdefault.jpg',
        preview: true
      },
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

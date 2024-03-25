"use strict"

const { Spot, Image } = require("../models")

let options = {}
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const spot = await Spot.findOne({ where: { address: "1 Street" } })

    await Image.bulkCreate([
      {
        imageableId: spot.id,
        imageableType: "Spot",
        url: "https://www.rocketmortgage.com/resources-cmsassets/RocketMortgage.com/Article_Images/Large_Images/Stock-Modern-House-With-Large-Pool-AdobeStock-127770833-Copy.jpg",
        preview: true,
      },
      {
        imageableId: spot.id,
        imageableType: "Spot",
        url: "https://foyr.com/learn/wp-content/uploads/2022/05/foyer-or-entry-hall-types-of-rooms-in-a-house-1024x819.jpg",
        preview: true,
      },
      {
        imageableId: spot.id,
        imageableType: "Spot",
        url: "https://i.pinimg.com/originals/e6/75/fd/e675fdaff9eff01341e1e4671b04bd4a.jpg",
        preview: true,
      },

      {
        imageableId: spot.id,
        imageableType: "Spot",
        url: "https://images.adsttc.com/media/images/5aa1/1e50/f197/cc90/d100/0055/large_jpg/070-Bukit_Kopi_Residence_(TWA)_-16__18.11.2017-.jpg",
        preview: true,
      },
      {
        imageableId: spot.id,
        imageableType: "Spot",
        url: "https://hips.hearstapps.com/hmg-prod/images/edc100121fernandez-008-1631204495.jpg",
        preview: true,
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    const spot = await Spot.findOne({ where: { address: "1 Street" } })
    options.tableName = "Images"
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(
      options,
      {
        imageableId: { [Op.in]: [spot.id] },
      },
      {}
    )
  },
}

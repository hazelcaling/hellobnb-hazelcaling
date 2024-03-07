"use strict"

const { Spot, User, Review } = require("../models")

let options = {}
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const user = await User.findOne({ where: { username: "FakeUser1" } })
    const user2 = await User.findOne({ where: { username: "FakeUser2" } })
    const spot = await Spot.findOne({ where: { address: "1 Street" } })
    await Review.bulkCreate([
      {
        userId: user.id,
        spotId: spot.id,
        review: "This is review 1",
        stars: 4,
      },
      {
        userId: user2.id,
        spotId: spot.id,
        review: "This is review 2",
        stars: 3,
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Reviews"
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(
      options,
      {
        review: { [Op.in]: ["This is review 1", "This is review 2"] },
      },
      {}
    )
  },
}

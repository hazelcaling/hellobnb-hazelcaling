"use strict"

const { Spot, User } = require("../models")

let options = {}
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA // define your schema in options object
}
const spots = []

module.exports = {
  async up(queryInterface, Sequelize) {
    const user = await User.findOne({ where: { username: "Demo-lition" } })
    const user2 = await User.findOne({ where: { username: "FakeUser1" } })
    const user3 = await User.findOne({ where: { username: "FakeUser2" } })

    for (let i = 0; i < 10; i++) {
      const spot = {
        ownerId: user.id,
        address: `${i + 1} Street`,
        city: "New York",
        state: "NY",
        country: "United States",
        lat: 1,
        lng: 1,
        name: `Debugging Haven ${i + 1}`,
        description:
          "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quia nam debitis reprehenderit ipsum possimus veniam. Non, sequi? Ducimus itaque similique ipsam velit explicabo eum reiciendis totam, laudantium quae expedita assumenda voluptatibus a amet, nulla, recusandae pariatur iusto maiores inventore optio!",
        price: i + 100,
      }
      spots.push(spot)
    }
    for (let i = 0; i < 10; i++) {
      const spot2 = {
        ownerId: user2.id,
        address: `${i + 50} Street`,
        city: "San Francisco",
        state: "CA",
        country: "United States",
        lat: 15,
        lng: 15,
        name: `Debugging Haven ${i + 50}`,
        description:
          "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quia nam debitis reprehenderit ipsum possimus veniam. Non, sequi? Ducimus itaque similique ipsam velit explicabo eum reiciendis totam, laudantium quae expedita assumenda voluptatibus a amet, nulla, recusandae pariatur iusto maiores inventore optio!",
        price: i + 200,
      }
      spots.push(spot2)
    }
    for (let i = 0; i < 10; i++) {
      const spot3 = {
        ownerId: user3.id,
        address: `${i + 100} Street`,
        city: "San Francisco",
        state: "CA",
        country: "United States",
        lat: 15,
        lng: 15,
        name: `Debugging Haven ${i + 100}`,
        description:
          "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quia nam debitis reprehenderit ipsum possimus veniam. Non, sequi? Ducimus itaque similique ipsam velit explicabo eum reiciendis totam, laudantium quae expedita assumenda voluptatibus a amet, nulla, recusandae pariatur iusto maiores inventore optio!",
        price: i + 300,
      }
      spots.push(spot3)
    }
    await Spot.bulkCreate(
      // [
      //   {
      //     ownerId: user.id,
      //     address: "1 Street",
      //     city: "New York",
      //     state: "CA",
      //     country: "United States",
      //     lat: 1,
      //     lng: 1,
      //     name: "Debugging Haven",
      //     description:
      //       "Relax in our Byte-sized bungalow inspire creativity enjoy every moment of zen.",
      //     price: 110,
      //   },
      //   {
      //     ownerId: user.id,
      //     address: "Coding Cabana",
      //     city: "San Francisco",
      //     state: "CA",
      //     country: "United States",
      //     lat: 1,
      //     lng: 1,
      //     name: "Spot Name 2",
      //     description:
      //       "Peaceful Sanctuary stocked with board games and coding themed decor",
      //     price: 201,
      //   },
      // ],
      spots,
      { validate: true }
    )
  },

  async down(queryInterface, Sequelize) {
    const address = []
    spots.forEach((spot) => {
      address.push(spot.address)
    })
    options.tableName = "Spots"
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(
      options,
      {
        address: { [Op.in]: address },
      },
      {}
    )
  },
}

'use strict';

const { Model, Validator, Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.User, { foreignKey: 'userId'});
      Booking.belongsTo(models.Spot, { foreignKey: 'spotId'});

    }
  }
  Booking.init({
    userId: DataTypes.INTEGER,
    spotId: DataTypes.INTEGER,
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      // validate: {
      //   same
      // }

    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      // validate: {
      //   lteStartDate(value) {
      //     if (new Date(this.endDate) <= this.startDate) {
      //       throw new Error();
      //     }
      //   }

      // }
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};

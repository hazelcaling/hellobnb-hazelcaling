'use strict';

const { Model, Validator } = require('sequelize');

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
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfter: {
          args: [this.startDate],
          msg: "endDate cannot be on or before startDate"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};

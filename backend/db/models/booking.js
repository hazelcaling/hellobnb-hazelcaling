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
      //   isbeforeCurrentDate() {
      //     if (new Date(this.startDate) < new Date()) {
      //       throw new Error('Start date cannot be in the past')
      //     }
      //   }
      // }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      // validate: {
      //   isbeforeStartDate() {
      //     if (this.endDate <= this.startDate) {
      //       throw new Error('endDate cannot be on or before startDate')
      //     }
      //   },
      //   isbeforeCurrentDate() {
      //     if (this.endDate <= new Date()) {
      //       throw new Error('End date cannot be in the past')
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

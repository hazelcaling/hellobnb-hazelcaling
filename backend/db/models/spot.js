'use strict';

const { Model, Validator } = require('sequelize');
const { Review } = require('../models');

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      Spot.hasMany(models.Image, {
        foreignKey: 'imageableId',
        constraints: false,
        scope: {
          imageableType: 'Spot'
        }
      });
      Spot.hasMany(models.Booking, { foreignKey: 'spotId', onDelete: 'cascade', hooks: true });
      Spot.hasMany(models.Review, { foreignKey: 'spotId', onDelete: 'cascade', hooks: true });

      Spot.belongsTo(models.User, { foreignKey: 'ownerId'});
    }
  }
  Spot.init({
    ownerId: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.FLOAT,
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};

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
    ownerId: {
      type: DataTypes.STRING,
      // allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type:DataTypes.STRING,
      allowNull: false
    },
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    name: {
      type: DataTypes.STRING,
    },
    description: {
      type:DataTypes.STRING,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};

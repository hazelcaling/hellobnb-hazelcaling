'use strict';

const { Model, Validator } = require('sequelize');
const { Review } = require('../models');

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      Spot.hasMany(models.Image, {
        foreignKey: 'imageableId',
        as: 'previewImage',
        constraints: false,
        scope: {
          imageableType: 'Spot'
        }
      });
      Spot.hasMany(models.Booking, { foreignKey: 'spotId', onDelete: 'cascade', hooks: true });
      Spot.hasMany(models.Review, { foreignKey: 'spotId', onDelete: 'cascade', hooks: true });

      Spot.belongsTo(models.User, {foreignKey: 'ownerId'});
    }

    getNumReviews = async function (spotId) {
      return await Review.count({where:{spotId: spotId}})
    }
    getAverageRating = async function (spotId) {
      const numReviews = getNumReviews(spotId);
      totalSum = await Review.sum('stars')
      return totalSum / numReviews
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.STRING,
      // allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
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
    },
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};

'use strict';

const { Model, Validator } = require('sequelize');


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

      Spot.hasMany(models.Image, {
        foreignKey: 'imageableId',

        as: 'SpotImages',
        constraints: false,
        scope: {
          imageableType: 'Spot'
        }
      });

      Spot.hasMany(models.Booking, { foreignKey: 'spotId', onDelete: 'cascade', hooks: true });
      Spot.hasMany(models.Review, { foreignKey: 'spotId', onDelete: 'cascade', hooks: true });

      Spot.belongsTo(models.User, {foreignKey: 'ownerId', as: 'Owner'});
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

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
    lat: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: {
          args: [-90],
          msg: 'Latitude must be within -90 and 90'
        },
        max: {
          args: [90],
          msg: 'Latitude must be within -90 and 90'
        }
      }
    },
    lng: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: {
          args: [-180],
          msg: 'Longitude must be within -180 and 180'
        },
        max: {
          args: [180],
          msg: 'Longitude must be within -180 and 180'
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1,50],
          msg: 'Name must be less than 50 characters'
        }
      }
    },
    description: {
      type:DataTypes.STRING,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'Price per day must be a positive number'
        }

      }
    },
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};

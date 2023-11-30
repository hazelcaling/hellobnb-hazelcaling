'use strict';

const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Image.belongsTo(models.Spot, {
        foreignKey: 'imageableId',
        constraints: false
      });
      Image.belongsTo(models.Review, {
        foreignKey: 'imageableId',
        constraints: false
      });
    }
  }
  Image.init({
    imageableId: DataTypes.INTEGER,
    imageableType: DataTypes.STRING,
    url: DataTypes.STRING,
    preview: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};

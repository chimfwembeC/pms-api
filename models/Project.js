'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      // Define associations here
      Project.belongsTo(models.User, {
        foreignKey: 'createdBy',
        as: 'creator'
      });
      Project.hasMany(models.Task, {
        foreignKey: 'projectId',      
      });
    }
  };

  Project.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,

    },
    createdBy: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Project',
  });

  return Project;
};

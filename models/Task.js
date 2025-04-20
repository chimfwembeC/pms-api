// models/task.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      Task.belongsTo(models.User, {
        foreignKey: 'assignedTo',
        as: 'assigned'
      });
      Task.belongsTo(models.Project, {
        foreignKey: 'projectId',        
      });
    }
  }

  Task.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      allowNull: false
    },
    completed: {
      type: DataTypes.BOOLEAN,      
      defaultValue: false,
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Projects', // refers to table name
        key: 'id', // refers to column name in referenced table
      }
    },
    assignedTo: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Task',
  });

  return Task;
};

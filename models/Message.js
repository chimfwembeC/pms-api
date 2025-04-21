'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      // Each message has one sender (User)
      Message.belongsTo(models.User, {
        foreignKey: 'senderId',
        as: 'sender',
      });

      // Each message has one receiver (User)
      Message.belongsTo(models.User, {
        foreignKey: 'receiverId',
        as: 'receiver',
      });
    }
  }

  Message.init(
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      receiverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Message',
    //   tableName: 'Messages', // optional, default is plural of modelName
    }
  );

  return Message;
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Projects', [
      {
        title: 'Liquor Point Of Sale System - PHP',
        description: 'A system to help manage a liquor store ventory, stock and sales, AI integrated to help in descision making',
        createdBy: 1, // assuming this user id exists
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Personal Expense Tracker',
        description: 'System to Track personal expenses, and show expenditure, capital and expending habits',
        completed: false,
        createdBy: 2, // assuming this user id exists
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Projects', null, {});
  }
};

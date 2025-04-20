// seeders/YYYYMMDDHHMMSS-demo-tasks.js

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Tasks', [
      {
        title: 'Create the personal expense tracker app',
        description: 'Create the app using nodejs and firebase auth with react',
        dueDate: new Date(),
        priority: 1,
        projectId: 2, // assuming this project id exists
        assignedTo: 1, // assuming this user id exists
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Create the personal expense tracker app',
        description: 'Create github repo and push the codebase',
        dueDate: new Date(),
        priority: 1,
        projectId: 2, // assuming this project id exists
        assignedTo: 1, // assuming this user id exists
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Create liquor store POS',
        description: 'Begin setting up the system using laravel, jetstream auth and react',
        dueDate: new Date(),
        priority: 2,
        projectId: 2, // assuming this project id exists
        assignedTo: 2, // assuming this user id exists
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tasks', null, {});
  }
};

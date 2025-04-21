'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('password', 10);

    await queryInterface.bulkInsert('Users', [
      {
        username: 'user',
        email: 'user@example.com',
        role: 'user',
        bio: "",
        is_active: true,
        profile_path: "",
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin',
        bio: "",
        is_active: false,
        profile_path: "",
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};

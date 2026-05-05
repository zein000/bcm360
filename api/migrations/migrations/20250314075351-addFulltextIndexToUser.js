module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE \`user\`
      ADD FULLTEXT (\`firstName\`, \`lastName\`);
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE \`user\`
      DROP INDEX \`firstName\`;
    `);
  },
};

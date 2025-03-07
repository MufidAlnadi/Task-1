const {Umzug, SequelizeStorage} = require('umzug');
const sequelize = require('./database');

const umzug = new Umzug({
  migrations: {
    glob: 'migrations/*.js',
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({sequelize}),
  logger: console,
});

const runMigrations = async () => {
  try {
    await umzug.up();
    console.log('Migrations completed!');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  runMigrations().catch((error) => {
    console.error('Migration failed:', error);
  });
}

module.exports = umzug;

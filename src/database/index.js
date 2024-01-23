const Sequelize = require("sequelize");
const config = require("./config");

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    dialect: config.dialect,
    host: config.host,
    port: config.port,
    pool: {
      ...config.pool,
    },
    logging: true,
  }
);
module.exports = {
  sequelize,
  Sequelize,
};

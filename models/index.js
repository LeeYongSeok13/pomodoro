const Sequelize = require("sequelize");
const config = require(__dirname + "/../config/config.js")["development"];

const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require("./User")(sequelize, Sequelize.DataTypes);
db.Task = require("./Task")(sequelize, Sequelize.DataTypes);

module.exports = db;

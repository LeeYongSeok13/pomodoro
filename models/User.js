/**
 * @param {import("sequelize").Sequelize} Sequelize
 * @param {import("sequelize").DataTypes} DataTypes
 */

const user = (Sequelize, DataTypes) => {
  return Sequelize.define("user", {});
};

module.exports = user;

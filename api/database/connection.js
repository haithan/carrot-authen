const Sequelize = require('sequelize');

const sequelize = new Sequelize('mariadb://admin:1qaz2wsx@carrott-node.cmoyikxbbpvu.eu-west-2.rds.amazonaws.com/carrott');

module.exports = sequelize;

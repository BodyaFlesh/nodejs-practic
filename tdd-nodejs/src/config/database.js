const Sequelize = require('sequelize');

const sequelize = new Sequelize("hoaxify", "serv_root", "jsdgw351;o94", {
    dialect: "mysql",
    logging: false
});

module.exports = sequelize;
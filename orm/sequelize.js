const { Sequelize } = require("sequelize");
exports.orm = new Sequelize('database', 'username', 'password', {
    host: 'host',
    dialect: 'postgres',
    define: {
        timestamps: false
    }
});

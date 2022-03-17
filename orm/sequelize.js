const {Sequelize} = require("sequelize");
exports.orm = new Sequelize('api', 'api', 'cE6sC1gH', {
    host: 'localhost', dialect: 'postgres', define: {
        timestamps: false
    }
});

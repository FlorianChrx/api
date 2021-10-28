const { DataTypes } = require('sequelize');
const { orm } = require('../orm/sequelize');

exports.Trade = orm.define('Trade', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    amount: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    sell: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    symbol: {
        type: DataTypes.STRING(4),
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false
    },
}, {
    tableName: 'trade'
});
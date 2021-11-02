const { DataTypes } = require('sequelize');
const { orm } = require('../orm/sequelize');

exports.Text = orm.define('Text', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    tag: {
        type: DataTypes.STRING(128),
        allowNull: false
    },
    value: {
        type: DataTypes.STRING(1024)
    }
}, {
    tableName: 'text'
});
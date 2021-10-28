const { DataTypes } = require('sequelize');
const { orm } = require('../orm/sequelize');

exports.Experience = orm.define('Experience', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    start: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end: {
        type: DataTypes.DATE
    },
    label: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING(1024)
    },
    company: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'experience'
});
const {DataTypes} = require('sequelize');
const {orm} = require('../orm/sequelize');

exports.Training = orm.define('Training', {
    // Model attributes are defined here
    id: {
        type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true
    }, date: {
        type: DataTypes.DATE, allowNull: false
    }, label: {
        type: DataTypes.STRING, allowNull: false
    }, description: {
        type: DataTypes.STRING(1024)
    }, school: {
        type: DataTypes.STRING, allowNull: false
    }
}, {
    tableName: 'training'
});
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const Sequelize_1 = require("Sequelize");
const database_1 = require("../util/database");
exports.Users = database_1.sequelize.define('Users', {
    id: {
        autoIncrement: true,
        type: Sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    access_token: {
        type: Sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    refresh_token: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    firstname: {
        type: Sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    lastname: {
        type: Sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    image: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    email: {
        type: Sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    password: {
        type: Sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    createdAt: {
        type: Sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize_1.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        type: Sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize_1.Sequelize.literal('CURRENT_TIMESTAMP')
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'users',
    timestamp: false,
});

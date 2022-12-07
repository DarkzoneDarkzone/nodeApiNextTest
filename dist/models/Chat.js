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
    message: {
        type: Sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    member_id: {
        type: Sequelize_1.DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'chat',
    timestamp: false,
});

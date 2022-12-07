import { Sequelize, DataTypes } from 'Sequelize'
import { sequelize } from '../util/database'

export const Users = sequelize.define('Users',
{
    id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    member_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'chat',
    timestamp: false,
})
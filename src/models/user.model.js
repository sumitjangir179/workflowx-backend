import { DataTypes } from "sequelize";
import { sequelize } from "../constants.js";
import bcrypt from 'bcrypt';

const User = sequelize.define('User',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        avatar: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        refreshToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },

    },

    {
        timestamps: true
    }


);

User.beforeSave(async (user, options) => {
    console.log('beforeSave hook triggered');
    console.log('user', user);
    console.log('options', options);

    if (!user.changed('password')) return 

    user.password = await bcrypt.hash(user.password, 10)
    return

})

export default User;

import { DataTypes, Sequelize } from "sequelize";

const sequelize = new Sequelize(`${process.env.DB_URI}/${DB_NAME}`);

const User = sequelize.define('User',
    {
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

        userName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
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

export default User;

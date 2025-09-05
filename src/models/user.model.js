import { DataTypes } from "sequelize";
import { sequelize } from "../constants.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const User = sequelize.define('User',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }, 

        name: {
            type: DataTypes.STRING,
            allowNull: true,
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
    if (!user.changed('password')) return
    user.password = await bcrypt.hash(user.password, 10)
    return
})

User.prototype.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

User.prototype.generateAccessToken = function () {
    return jwt.sign({ id: this.id, email: this.email, fullName: this.fullName,}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION })
}

User.prototype.generateRefreshToken = function () {
    return jwt.sign({ id: this.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION })
}



export default User;

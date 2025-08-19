import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config('./.env');

export const sequelize = new Sequelize(`${process.env.DB_URI}`);
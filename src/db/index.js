import { Sequelize } from "sequelize";
import { DB_NAME } from "../contants.js";

const connetDb = async () => {
    try {
        const sequelize = new Sequelize(`${process.env.DB_URI}/${DB_NAME}`);
        await sequelize.authenticate();
        console.log("Database connection established successfully.");

    } catch (error) {
        console.error("Error connecting to the database:", error);
        process.exit(1);
    }
}

export default connetDb;
import { sequelize } from "../constants.js";

const connetDb = async () => {
    try {
        await sequelize.authenticate();
        // await sequelize.sync({ force: true }); // Use force: true only for development to drop and recreate tables
        console.log("Database connection established successfully.");

    } catch (error) {
        console.error("Error connecting to the database:", error);
        process.exit(1);
    }
}

export default connetDb;
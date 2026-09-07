import "dotenv/config";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5050;

const startServer = async (): Promise<void> => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Skill Track API is running on port ${PORT}`);
    })
}

startServer();
import "dotenv/config";
import connectDB from "./config/db.js";
import app from "./app.js";

const PORT = Number(process.env.PORT ?? 5050);

const startServer = async (): Promise<void> => {
    if (!Number.isInteger(PORT) || PORT <= 0) {
        throw new Error("PORT must be a positive integer");
    }

    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Skill Track API is running on port ${PORT}`);
    })
}

startServer();

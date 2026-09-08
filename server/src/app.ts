import "dotenv/config";
import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import helmet from "helmet";

import skillRoutes from "./routes/skill.routes.js"
import topicRoutes from "./routes/topic.routes.js"
import skillDependencyRoutes from "./routes/SkillDependency.routes.js"
import roadmapRoutes from "./routes/roadmap.routes.js"
import authRoutes from "./routes/user.routes.js"
import learningProgressRoutes from "./routes/learningProgress.routes.js"
import dailyGoalRoutes from "./routes/dailyGoal.routes.js"
import dsaProblemRoutes from "./routes/dsaProblem.routes.js"
import dsaProgressRoutes from "./routes/dsaProgress.routes.js"
import dsaTopicRoutes from "./routes/dsaTopic.routes.js"
import recommendationRoutes from "./routes/recommendation.routes.js"
import dashboardRoutes from "./routes/dashboard.routes.js"
import learningActivityRoutes from "./routes/learningActivity.routes.js"
import aiRecommendationRoutes from "./routes/aiRecommendation.routes.js"

import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

app.use(cookieParser());
app.use(express.json({limit: "1mb"}));
app.use(helmet());

const allowedOrigins = (process.env.CLIENT_URL ?? "https://skilltrack-ala0.onrender.com")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
app.use(
    cors({
        origin: (origin, callback) => {
            // API clients and same-origin requests may not send an Origin header.
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }

            callback(new Error("Origin is not allowed by CORS"));
        },
        credentials: true,
    })
);

app.get("/api/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Skill Track API Running",
    });
});

app.use("/api/skills", skillRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/skill-dependencies", skillDependencyRoutes);
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/progress", learningProgressRoutes);
app.use("/api/daily-goals", dailyGoalRoutes);
app.use("/api/dsa/problems", dsaProblemRoutes);
app.use("/api/dsa/progress", dsaProgressRoutes);
app.use("/api/dsa/topics", dsaTopicRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/activity", learningActivityRoutes);
app.use("/api/ai/recommendations", aiRecommendationRoutes);

app.use(errorMiddleware);

export default app;

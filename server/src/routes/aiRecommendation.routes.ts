import { Router } from "express";

import {
    getAIRecommendationsController,
} from "../controllers/aiRecommendation.controller.js";

import {
    authMiddleware,
} from "../middleware/auth.middleware.js";
import { aiRateLimiter } from "../middleware/rateLimit.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get(
    "/",
    aiRateLimiter,
    getAIRecommendationsController
);

export default router;

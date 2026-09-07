import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getLearningRecommendationsController } from "../controllers/recommendation.controller.js";


const router = Router();

router.use(authMiddleware);

router.get("/", getLearningRecommendationsController);

export default router;
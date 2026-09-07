import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createDailyGoalController, getTodayDailyGoalController, getUserStreakController, updateDailyGoalProgressController } from "../controllers/dailyGoal.controller.js";


const router = Router();

router.use(authMiddleware);

router.post("/", createDailyGoalController);
router.get("/today", getTodayDailyGoalController);
router.get("/streak", getUserStreakController);
router.put("/today/progress", updateDailyGoalProgressController);

export default router;
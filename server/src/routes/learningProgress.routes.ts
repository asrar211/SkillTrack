import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getProgressSummaryController, getSkillLearningProgressController, getTopicLearningProgressController, getUserLearningProgressController, updateLearningProgressController } from "../controllers/learningProgress.controller.js";


const router = Router();

router.use(authMiddleware);

router.get("/", getUserLearningProgressController);
router.get("/summary", getProgressSummaryController);
router.get("/skills/:skillId", getSkillLearningProgressController);
router.get("/skills/:skillId/topics", getTopicLearningProgressController);
router.put("/", updateLearningProgressController);

export default router;
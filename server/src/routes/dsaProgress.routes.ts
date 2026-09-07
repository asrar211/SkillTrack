import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getDSASummaryController, getUserDSAProgressController, updateDSAProgressController } from "../controllers/dsaProgress.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/summary", getDSASummaryController);
router.get("/", getUserDSAProgressController);
router.put("/", updateDSAProgressController);

export default router;
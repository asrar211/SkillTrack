import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getDashboardController } from "../controllers/dashboard.controller.js";


const router = Router();

router.use(authMiddleware);

router.get("/", getDashboardController);

export default router;
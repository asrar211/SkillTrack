import { Router } from "express";

import {
    getLearningActivityController,
} from "../controllers/learningActivity.controller.js";

import {
    authMiddleware,
} from "../middleware/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get(
    "/",
    getLearningActivityController
);

export default router;
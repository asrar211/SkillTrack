import { Router } from "express";

import {
    createDSATopicController,
    getDSATopicsController,
} from "../controllers/dsaTopic.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getDSATopicsController);

router.post("/", authMiddleware, createDSATopicController);

export default router;
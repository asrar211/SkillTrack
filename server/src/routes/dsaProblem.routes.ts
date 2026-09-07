import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createDSAProblemController, getDSAProblemByIdController, getDSAProblemsController } from "../controllers/dsaProblem.controller.js";


const router = Router();


router.get("/", getDSAProblemsController);
router.get("/:id", getDSAProblemByIdController);
router.post("/", authMiddleware, createDSAProblemController);

export default router
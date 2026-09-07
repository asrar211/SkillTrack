import { Router } from "express";
import { getCurrentUserController, loginUserController, logoutUserController, registerUserController } from "../controllers/user.controller.js";
import { authRateLimiter } from "../middleware/rateLimit.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";


const router = Router();

router.post("/register", authRateLimiter, registerUserController);
router.post("/login", authRateLimiter, loginUserController);
router.get("/me", authMiddleware, getCurrentUserController)
router.post("/logout", logoutUserController)

export default router;
import { Router } from "express";
import { addRoadmapItemController, createRoadmapController, deleteRoadmapController, getRoadmapByIdController, getRoadmapProgressController, getRoadmapsController, removeRoadmapItemController, reorderRoadmapItemsController, updateRoadmapItemController } from "../controllers/roadmap.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";


const router = Router();

router.use(authMiddleware);

router.get("/", getRoadmapsController);
router.get("/:id/progress", getRoadmapProgressController);
router.get("/:id", getRoadmapByIdController)
router.post("/", createRoadmapController);
router.post("/:id/items", addRoadmapItemController);
router.delete("/:id/items/:itemId", removeRoadmapItemController);
router.patch("/:id/items/:itemId", updateRoadmapItemController);
router.patch("/:id/items/reorder", authMiddleware, reorderRoadmapItemsController)
router.delete("/:id", deleteRoadmapController)

export default router;
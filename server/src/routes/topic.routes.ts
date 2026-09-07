import { Router } from "express";
import { createTopicController, deleteTopicController, getTopicByIdController, getTopicsBySkillController, getTopicsController, updateTopicController } from "../controllers/topic.controller.js";

const router = Router();

router.get("/skill/:skillId", getTopicsBySkillController);
router.get("/", getTopicsController);
router.get("/:id", getTopicByIdController);
router.post("/", createTopicController);
router.patch("/:id", updateTopicController);
router.delete("/:id", deleteTopicController);

export default router;
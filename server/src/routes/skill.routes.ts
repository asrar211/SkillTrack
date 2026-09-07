import { Router } from "express";
import { createSkillController, deleteSkillController, getSkillByIdController, getSkillsController, updateSkillController } from "../controllers/skill.controller.js";

const router = Router();

router.get("/", getSkillsController);
router.get("/:id", getSkillByIdController);
router.post("/", createSkillController);
router.patch("/:id", updateSkillController);
router.delete("/:id", deleteSkillController)

export default router;
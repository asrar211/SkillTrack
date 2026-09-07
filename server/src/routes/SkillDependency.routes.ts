import Router from "express";
import { createSkillDependencyController, getDependentsController, getPrerequisitesController, getSkillDependenciesController } from "../controllers/skillDependency.controller.js";

const router = Router();

router.get("/", getSkillDependenciesController);
router.get("/:skillId/prerequisites", getPrerequisitesController);
router.get("/:skillId/dependents", getDependentsController);
router.post("/", createSkillDependencyController);

export default router;
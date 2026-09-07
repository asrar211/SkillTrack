import type { Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { isValidObjectId } from "../utils/validation.js";
import { createSkillDependency, getDependents, getPrerequisites, getSkillDependencies } from "../services/skillDependency.service.js";


export const createSkillDependencyController = async (
    req: Request,
    res: Response
): Promise<void> => {
    const {prerequisiteSkillId, dependentSkillId} = req.body;
    if (!prerequisiteSkillId || !dependentSkillId) {
        throw new AppError("prerequisiteSkillId and skillId are required", 400);
    }

    if (!isValidObjectId(prerequisiteSkillId)) {
        throw new AppError("Invalid prerequisite skill ID", 400);
    }

    if (!isValidObjectId(dependentSkillId)) {
        throw new AppError("Invalid skill ID", 400);
    }

    const dependency = await createSkillDependency({prerequisiteSkillId, dependentSkillId});

    res.status(201).json({
        success: true,
        message: "Skill Dependency created Successfully",
        data: dependency
    });
}

export const getSkillDependenciesController = async (
    _req: Request,
    res: Response
): Promise<void> => {
    const dependencies = await getSkillDependencies();

    res.status(200).json({
        success: true,
        data: dependencies
    })
}

export const getPrerequisitesController = async (
    req: Request,
    res: Response
): Promise<void> => {
    const {skillId} = req.params as {skillId: string};

    if (!isValidObjectId(skillId)) {
        throw new AppError("Invalid Skill ID", 400);
    }

    const prerequisites = await getPrerequisites(skillId);

    res.status(200).json({
        success: true,
        data: prerequisites
    })
}

export const getDependentsController = async (
    req: Request,
    res: Response
): Promise<void> => {
    const {skillId} = req.params as {skillId: string};

    if (!isValidObjectId(skillId)) {
        throw new AppError("Invalid Skill ID", 400);
    }

    const dependents = await getDependents(skillId);

    res.status(200).json({
        success: true,
        data: dependents,
    });
}
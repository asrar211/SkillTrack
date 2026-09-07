import type { Request, Response } from "express";
import { createSkill, deleteSkill, getSkillById, getSkills, updateSkill } from "../services/skill.service.js";
import { isValidObjectId } from "../utils/validation.js";
import { AppError } from "../utils/AppError.js";

export const createSkillController = async (
    req: Request,
    res: Response
): Promise<void> => {
        const skill = await createSkill(req.body);

        res.status(201).json({
            success: true,
            message: "Skill created successfully",
            data: skill
        });
}

export const getSkillsController = async (
    req: Request,
    res: Response
): Promise<void> => {
        const skills = await getSkills();

        res.status(200).json({
            success: true,
            data: skills
        });
}

export const getSkillByIdController = async (
    req: Request,
    res: Response
): Promise<void> => {
        const { id } = req.params as {id: string};
        
        if(!isValidObjectId(id)) {
            throw new AppError("Invalid Skill ID", 400);
        }
        const skill = await getSkillById(id);

        if(!skill){
            throw new AppError("Skill Not Found", 404);
        }

        res.status(200).json({
            success: true,
            data: skill
        });
}


export const updateSkillController = async (
    req: Request,
    res: Response
): Promise<void> => {
        const { id } = req.params as {id: string };

    if(!isValidObjectId(id)){
        throw new AppError("Invalid Skill ID", 400);
    }

    const allowedFields = [
        "name",
        "slug",
        "description",
        "domain",
        "icon"
    ];

    const updatedData: Record<string, unknown> = {};

    for(const field of allowedFields){
        if(req.body[field] !== undefined){
            updatedData[field] = req.body[field];
        }
    }

    if(Object.keys(updatedData).length === 0) {
        throw new AppError("No valid fields provided for update", 400)
    }

    const skill = await updateSkill(id, updatedData);

    if (!skill) {
      throw new AppError("Skill Not Found", 404);
    }

    res.status(200).json({
        success: true,
        message: "Skill Updated Successfully",
        data: skill
    });
}

export const deleteSkillController = async (
    req: Request,
    res: Response
): Promise<void> => {
    const {id} = req.params as {id: string};

    if(!isValidObjectId(id)) {
        throw new AppError("Invalid Skill ID", 400);
    }

    const skill = await deleteSkill(id);

    if(!skill) {
        throw new AppError("Skill not found", 404);
    }

    res.status(200).json({
        success: true,
        message: "Skill Archived successfully"
    });
}
import type { Request, Response } from "express";
import { createTopic, deleteTopic, getTopicById, getTopics, getTopicsBySkill, updateTopic } from "../services/topic.service.js";
import { isValidObjectId } from "../utils/validation.js";
import { AppError } from "../utils/AppError.js";

export const createTopicController = async (
    req: Request,
    res: Response
): Promise<void> => {
    const {skillId, name, slug, description, order} = req.body;
    if (!skillId || !name || !slug || order === undefined) {
        throw new AppError("skillId, name, slug and order are required",400);
    }

    if (!isValidObjectId(skillId)) {
        throw new AppError("Invalid Skill ID", 400);
    }

    const topic = await createTopic({
        skillId,
        name,
        slug,
        description,
        order
    });

    res.status(201).json({
        success: true,
        message: "Topic created successfully",
        data: topic
    })

}


export const getTopicsController = async (
    _req: Request,
    res: Response
): Promise<void> => {

    const topics = await getTopics();

    res.status(200).json({
        success: true,
        data: topics,
    });
};


export const getTopicByIdController = async (
    req: Request,
    res: Response
): Promise<void> => {

    const { id } = req.params as { id: string };

    if (!isValidObjectId(id)) {
        throw new AppError("Invalid Topic ID", 400);
    }

    const topic = await getTopicById(id);

    if (!topic) {
        throw new AppError("Topic not found", 404);
    }

    res.status(200).json({
        success: true,
        data: topic,
    });
};


export const getTopicsBySkillController = async (
    req: Request, 
    res: Response
): Promise<void> => {
    const {skillId} = req.params as {skillId: string};

    if (!isValidObjectId(skillId)) {
        throw new AppError("Invalid Skill ID", 400);
    }

    const topics = await getTopicsBySkill(skillId);

    res.status(200).json({
        success: true,
        data: topics
    })
}


export const updateTopicController =async (
    req: Request,
    res: Response
): Promise<void> => {
    const {id} = req.params as {id: string};

    if (!isValidObjectId(id)) {
        throw new AppError("Invalid Topic ID", 400);
    }

    const allowedFields = [
        "name",
        "slug",
        "description",
        "order",
    ];

    const updatedData: Record<string, unknown> = {};

    for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
            updatedData[field] = req.body[field];
        }
    }

    if (Object.keys(updatedData).length === 0) {
        throw new AppError("No valid fields provided for update",400);
    }

    const topic = await updateTopic(id, updatedData);

    if (!topic) {
        throw new AppError("Topic not found", 404);
    }

    res.status(200).json({
        success: true,
        message: "Topic updated successfully",
        data: topic,
    });

}

export const deleteTopicController = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { id } = req.params as { id: string };

    if (!isValidObjectId(id)) {
        throw new AppError("Invalid Topic ID", 400);
    }

    const topic = await deleteTopic(id);

    if (!topic) {
        throw new AppError("Topic not found", 404);
    }

    res.status(200).json({
        success: true,
        message: "Topic archived successfully",
    });
};


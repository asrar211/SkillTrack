import type { Request, Response } from "express";

import { addRoadmapItem, createRoadmap, deleteRoadmap, getRoadmapById, getRoadmapByUser, getRoadmapProgress, removeRoadmapItem, reorderRoadmapItems, updateRoadmapItem } from "../services/roadmap.service.js";
import { AppError } from "../utils/AppError.js";
import { isValidObjectId } from "mongoose";

export const createRoadmapController = async (
    req: Request,
    res: Response
): Promise<void> => {

    const userId= req.userId;

    if(!userId) {
        throw new AppError("Authentication Required", 401);
    }
    const {
        name, description, items } = req.body;

    if (!name || typeof name !== "string") {
        throw new AppError("Roadmap name is required", 400);
    }

    if (!Array.isArray(items)) {
        throw new AppError("Roadmap items must be an array",400);
    }

    const roadmap = await createRoadmap(
        userId,
        {
        name,
        description,
        items,
    });

    res.status(201).json({
        success: true,
        message: "Roadmap created successfully",
        data: roadmap,
    });
};

export const reorderRoadmapItemsController = async (
    req: Request,
    res: Response
): Promise<void> => {

    const userId = req.userId;

    if (!userId) {
        throw new AppError("Authentication required",401);
    }

    const { id } = req.params as { id: string };

    if (!isValidObjectId(id)) {
        throw new AppError("Invalid Roadmap ID", 400);
    }

    const { items } = req.body;

    if (!Array.isArray(items)) {
        throw new AppError("Items must be an array",400);
    }

    for (const item of items) {
        if (!item || typeof item.itemId !== "string" || typeof item.order !== "number") {
            throw new AppError("Each item requires itemId and order",400);
        }

        if (!isValidObjectId(item.itemId)) {
            throw new AppError("Invalid roadmap item ID",400);
        }
    }

    const roadmap = await reorderRoadmapItems(
        id,
        userId,
        items
    );

    if (!roadmap) {
        throw new AppError("Roadmap not found",404);
    }

    res.status(200).json({
        success: true,
        message: "Roadmap reordered successfully",
        data: roadmap,
    });
};

export const getRoadmapsController = async (
    req: Request,
    res: Response
): Promise<void> => {
    const userId = req.userId;

    if(!userId) {
        throw new AppError("Authentication Required", 401);
    }

    const roadmaps = await getRoadmapByUser(userId);

    res.status(200).json({
        success: true,
        data: roadmaps
    })
}

export const getRoadmapByIdController = async (
    req: Request,
    res: Response
): Promise<void> => {
    const userId = req.userId;

    if(!userId) {
        throw new AppError("Authentication Required", 401);
    }

    const {id} = req.params as {id: string};
    if (!isValidObjectId(id)) {
        throw new AppError("Invalid Roadmap ID",400);
    }

    const roadmap = await getRoadmapById(id, userId);

    if(!roadmap) {
        throw new AppError("Roadmap not found", 404);
    }

    res.status(200).json({
        success: true,
        data: roadmap
    })
}

export const deleteRoadmapController = async (
    req: Request,
    res: Response
): Promise<void> => {
    const userId = req.userId;

    if (!userId) {
        throw new AppError("Authentication required",401);
    }

    const { id } = req.params as { id: string };

    if (!isValidObjectId(id)) {
        throw new AppError("Invalid Roadmap ID",400);
    }

    const roadmap = await deleteRoadmap(
        id,
        userId
    );

    if (!roadmap) {
        throw new AppError("Roadmap not found",404);
    }

    res.status(200).json({
        success: true,
        message: "Roadmap deleted successfully",
    });
}

export const getRoadmapProgressController = async (
    req: Request,
    res: Response
): Promise<void> => {

    const userId = req.userId;

    if (!userId) {
        throw new AppError(
            "Authentication required",
            401
        );
    }

    const { id } =
        req.params as { id: string };

    if (!isValidObjectId(id)) {
        throw new AppError(
            "Invalid Roadmap ID",
            400
        );
    }

    const progress = await getRoadmapProgress(
        id,
        userId
    );

    if (!progress) {
        throw new AppError(
            "Roadmap not found",
            404
        );
    }

    res.status(200).json({
        success: true,
        data: progress,
    });
};

export const addRoadmapItemController = async (
    req: Request,
    res: Response
): Promise<void> => {

    const userId = req.userId;

    if (!userId) {
        throw new AppError(
            "Authentication required",
            401
        );
    }

    const { id } =
        req.params as { id: string };

    if (!isValidObjectId(id)) {
        throw new AppError(
            "Invalid Roadmap ID",
            400
        );
    }

    const {
        skillId,
        topicId,
        priority,
        estimatedMinutes,
        targetDate,
        notes,
    } = req.body;

    if (
        typeof skillId !== "string" ||
        !isValidObjectId(skillId)
    ) {
        throw new AppError(
            "Valid skillId is required",
            400
        );
    }

    if (
        topicId !== undefined &&
        (
            typeof topicId !== "string" ||
            !isValidObjectId(topicId)
        )
    ) {
        throw new AppError(
            "Invalid topicId",
            400
        );
    }

    if (
        priority !== undefined &&
        !["low", "medium", "high"].includes(priority)
    ) {
        throw new AppError(
            "Priority must be low, medium, or high",
            400
        );
    }

    if (
        estimatedMinutes !== undefined &&
        (
            !Number.isInteger(estimatedMinutes) ||
            estimatedMinutes < 0
        )
    ) {
        throw new AppError(
            "estimatedMinutes must be a non-negative integer",
            400
        );
    }

    let parsedTargetDate: Date | undefined;

    if (targetDate !== undefined) {

        if (typeof targetDate !== "string") {
            throw new AppError(
                "targetDate must be a valid date",
                400
            );
        }

        const date = new Date(targetDate);

        if (Number.isNaN(date.getTime())) {
            throw new AppError(
                "Invalid targetDate",
                400
            );
        }

        parsedTargetDate = date;
    }

    if (
        notes !== undefined &&
        typeof notes !== "string"
    ) {
        throw new AppError(
            "notes must be a string",
            400
        );
    }

    const roadmap = await addRoadmapItem(
        id,
        userId,
        {
            skillId,
            topicId,
            priority,
            estimatedMinutes,
            targetDate: parsedTargetDate,
            notes,
        }
    );

    if (!roadmap) {
        throw new AppError(
            "Roadmap not found",
            404
        );
    }

    res.status(200).json({
        success: true,
        message: "Roadmap item added successfully",
        data: roadmap,
    });
};

export const removeRoadmapItemController = async (
    req: Request,
    res: Response
): Promise<void> => {

    const userId = req.userId;

    if (!userId) {
        throw new AppError(
            "Authentication required",
            401
        );
    }

    const {
        id,
        itemId,
    } = req.params as {
        id: string;
        itemId: string;
    };

    if (
        !isValidObjectId(id) ||
        !isValidObjectId(itemId)
    ) {
        throw new AppError(
            "Invalid roadmap or item ID",
            400
        );
    }

    const roadmap = await removeRoadmapItem(
        id,
        userId,
        itemId
    );

    if (!roadmap) {
        throw new AppError(
            "Roadmap not found",
            404
        );
    }

    res.status(200).json({
        success: true,
        message: "Roadmap item removed successfully",
        data: roadmap,
    });
};

export const updateRoadmapItemController = async (
    req: Request,
    res: Response
): Promise<void> => {

    const userId = req.userId;

    if (!userId) {
        throw new AppError(
            "Authentication required",
            401
        );
    }

    const {
        id,
        itemId,
    } = req.params as {
        id: string;
        itemId: string;
    };

    if (
        !isValidObjectId(id) ||
        !isValidObjectId(itemId)
    ) {
        throw new AppError(
            "Invalid roadmap or item ID",
            400
        );
    }

    const {
        priority,
        estimatedMinutes,
        targetDate,
        notes,
    } = req.body;

    if (
        priority !== undefined &&
        !["low", "medium", "high"].includes(priority)
    ) {
        throw new AppError(
            "Invalid priority",
            400
        );
    }

    if (
        estimatedMinutes !== undefined &&
        (
            !Number.isInteger(estimatedMinutes) ||
            estimatedMinutes < 0
        )
    ) {
        throw new AppError(
            "estimatedMinutes must be a non-negative integer",
            400
        );
    }

    let parsedTargetDate:
        Date | null | undefined;

    if (targetDate !== undefined) {

        if (targetDate === null) {
            parsedTargetDate = null;
        } else {

            const date = new Date(targetDate);

            if (Number.isNaN(date.getTime())) {
                throw new AppError(
                    "Invalid target date",
                    400
                );
            }

            parsedTargetDate = date;
        }
    }

    const roadmap = await updateRoadmapItem(
        id,
        userId,
        itemId,
        {
            priority,
            estimatedMinutes,
            targetDate: parsedTargetDate,
            notes,
        }
    );

    if (!roadmap) {
        throw new AppError(
            "Roadmap not found",
            404
        );
    }

    res.status(200).json({
        success: true,
        message: "Roadmap item updated successfully",
        data: roadmap,
    });
};
import Roadmap, { IRoadmap } from "../models/Roadmap.js";
import { validateRoadmapItems } from "../utils/roadmapValidation.js";
import { AppError } from "../utils/AppError.js";
import LearningProgress from "../models/LearningProgress.js";
import Topic from "../models/Topic.js";
import Skill from "../models/Skill.js";
import mongoose from "mongoose";


export const createRoadmap = async (
    userId: string,
    data:Pick<IRoadmap, "name" | "description" | "items">
): Promise<IRoadmap> => {
    await validateRoadmapItems(data.items);

    return Roadmap.create({
        userId,
        ...data,
    });
}

export const reorderRoadmapItems = async (
    roadmapId: string,
    userId: string,
    items: Array<{
        itemId: string;
        order: number;
    }>
): Promise<IRoadmap | null> => {

    const roadmap = await Roadmap.findOne({
        _id: roadmapId,
        userId,
    });

    if (!roadmap) {
        return null;
    }

    const roadmapItemIds = new Set(
        roadmap.items.map((item) => item._id?.toString())
    );

    const requestedItemIds = new Set(
        items.map((item) => item.itemId)
    );

    if (requestedItemIds.size !== roadmap.items.length) {
        throw new AppError("All roadmap items must be included",400);
    }

    if (requestedItemIds.size !== items.length) {
        throw new AppError("Duplicate roadmap item IDs are not allowed",400);
    }

    const orders = items.map((item) => item.order);

    const uniqueOrders = new Set(orders);

    if (uniqueOrders.size !== orders.length) {
        throw new AppError("Roadmap item orders must be unique",400);
    }

    const sortedOrders = [...orders].sort(
        (a, b) => a - b
    );

    for (let i = 0; i < sortedOrders.length; i++) {
        if (sortedOrders[i] !== i) {
            throw new AppError("Roadmap item orders must start at 0 and be sequential",400);
        }
    }

    for (const item of items) {

        if (!roadmapItemIds.has(item.itemId)) {
            throw new AppError("Invalid roadmap item ID",400);
        }
    }

for (const item of items) {
    const roadmapItem = roadmap.items.find(
        (roadmapItem) =>
            roadmapItem._id?.toString() === item.itemId
    );

    if (roadmapItem) {
        roadmapItem.order = item.order;
    }
    }

    roadmap.items.sort(
        (a, b) => a.order - b.order
    );

    return roadmap.save();
};

export const getRoadmapByUser = async (
    userId: string
): Promise<IRoadmap[]> => {
    return Roadmap.find({
        userId,
    }).sort({createdAt: -1});
}

export const getRoadmapById = async (
    roadmapId: string,
    userId: string
): Promise<IRoadmap | null> => {
    return Roadmap.findOne({
        _id: roadmapId,
        userId
    })
}

export const deleteRoadmap = async (
    roadmapId: string,
    userId: string
): Promise<IRoadmap | null> => {
    return Roadmap.findOneAndDelete({
        _id: roadmapId,
        userId
    });
}

export const getRoadmapProgress = async (
    roadmapId: string,
    userId: string
) => {
    const roadmap = await Roadmap.findOne({
        _id: roadmapId,
        userId
    }).populate("items.skillId", "name slug description")
    .populate("items.skillId", "name slug")

    if(!roadmap) {
        return null;
    }

    const progressRecords = await LearningProgress.find({
        userId,
    });

    const progressMap = new Map<
    string,
    {
        progress: number,
        status: string
    }>();

    for (const record of progressRecords) {
        const key = record.topicId
            ? `${record.skillId.toString()}:${record.topicId.toString()}`
            : record.skillId.toString();

        progressMap.set(key, {
            progress: record.progress,
            status: record.status,
        });
    }

    const items = roadmap.items
        .sort((a, b) => a.order - b.order)
        .map((item) => {

            const skillId = item.skillId._id.toString();

            const topicId = item.topicId
                ? item.topicId._id.toString()
                : undefined;

            const key = topicId
                ? `${skillId}:${topicId}`
                : skillId;

            const progress = progressMap.get(key);

            return {
                itemId: item._id,
                order: item.order,

                skill: item.skillId,
                topic: item.topicId ?? null,

                priority: item.priority,
                estimatedMinutes: item.estimatedMinutes,
                targetDate: item.targetDate ?? null,
                notes: item.notes ?? "",

                progress: progress?.progress ?? 0,
                status: progress?.status ?? "not-started",
            };
        });

    const overallProgress =
        items.length === 0
            ? 0
            : Math.round(
                items.reduce(
                    (sum, item) => sum + item.progress,
                    0
                ) / items.length
            );

    const completedItems = items.filter(
        (item) => item.status === "completed"
    ).length;

    const inProgressItems = items.filter(
        (item) => item.status === "in-progress"
    ).length;

    return {
        roadmap: {
            id: roadmap._id,
            name: roadmap.name,
            description: roadmap.description,
        },

        overallProgress,

        totalItems: items.length,
        completedItems,
        inProgressItems,

        items,
    };
};

export const addRoadmapItem = async (
    roadmapId: string,
    userId: string,
    data: {
        skillId: string;
        topicId?: string;
        priority?: "low" | "medium" | "high";
        estimatedMinutes?: number;
        targetDate?: Date;
        notes?: string;
    }
): Promise<IRoadmap | null> => {

    const roadmap = await Roadmap.findOne({
        _id: roadmapId,
        userId,
    });

    if (!roadmap) {
        return null;
    }

    const skill = await Skill.findOne({
        _id: data.skillId,
        isActive: true,
    });

    if (!skill) {
        throw new AppError(
            "Skill not found",
            404
        );
    }

    if (data.topicId) {
        const topic = await Topic.findOne({
            _id: data.topicId,
            skillId: data.skillId,
            isActive: true,
        });

        if (!topic) {
            throw new AppError(
                "Topic not found for this skill",
                404
            );
        }
    }

    const alreadyExists = roadmap.items.some(
        (item) =>
            item.skillId.toString() === data.skillId &&
            (
                data.topicId
                    ? item.topicId?.toString() === data.topicId
                    : !item.topicId
            )
    );

    if (alreadyExists) {
        throw new AppError(
            "This item already exists in the roadmap",
            409
        );
    }

    const nextOrder =
        roadmap.items.length === 0
            ? 0
            : Math.max(
                ...roadmap.items.map(
                    (item) => item.order
                )
            ) + 1;

    roadmap.items.push({
        skillId: new mongoose.Types.ObjectId(
            data.skillId
        ),

        ...(data.topicId
            ? {
                topicId: new mongoose.Types.ObjectId(
                    data.topicId
                ),
            }
            : {}),

        order: nextOrder,

        priority: data.priority ?? "medium",

        estimatedMinutes:
            data.estimatedMinutes ?? 0,

        ...(data.targetDate
            ? {
                targetDate: data.targetDate,
            }
            : {}),

        ...(data.notes
            ? {
                notes: data.notes.trim(),
            }
            : {}),
    });

    return roadmap.save();
};

export const removeRoadmapItem = async (
    roadmapId: string,
    userId: string,
    itemId: string
): Promise<IRoadmap | null> => {

    const roadmap = await Roadmap.findOne({
        _id: roadmapId,
        userId,
    });

    if (!roadmap) {
        return null;
    }

    const itemIndex = roadmap.items.findIndex(
        (item) => item._id?.toString() === itemId
    );

    if (itemIndex === -1) {
        throw new AppError(
            "Roadmap item not found",
            404
        );
    }

    roadmap.items.splice(itemIndex, 1);

    roadmap.items
        .sort((a, b) => a.order - b.order)
        .forEach((item, index) => {
            item.order = index;
        });

    return roadmap.save();
};

export const updateRoadmapItem = async (
    roadmapId: string,
    userId: string,
    itemId: string,
    data: {
        priority?: "low" | "medium" | "high";
        estimatedMinutes?: number;
        targetDate?: Date | null;
        notes?: string | null;
    }
): Promise<IRoadmap | null> => {

    const roadmap = await Roadmap.findOne({
        _id: roadmapId,
        userId,
    });

    if (!roadmap) {
        return null;
    }

    const item = roadmap.items.find(
    (item) => item._id?.toString() === itemId
);

    if (!item) {
        throw new AppError(
            "Roadmap item not found",
            404
        );
    }

    if (data.priority !== undefined) {
        item.priority = data.priority;
    }

    if (data.estimatedMinutes !== undefined) {
        item.estimatedMinutes =
            data.estimatedMinutes;
    }

    if (data.targetDate !== undefined) {
        item.targetDate =
            data.targetDate ?? undefined;
    }

    if (data.notes !== undefined) {
        item.notes =
            data.notes?.trim() || undefined;
    }

    return roadmap.save();
};

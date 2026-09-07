import mongoose from "mongoose";
import { IRoadmapItem } from "../models/Roadmap.js";
import { AppError } from "./AppError.js";
import Skill from "../models/Skill.js";
import Topic from "../models/Topic.js";


export const validateRoadmapItems = async (
    items: IRoadmapItem[]
): Promise<void> => {

    if (!Array.isArray(items)) {
        throw new AppError("Roadmap items must be an array", 400);
    }

    const skillIds = new Set<string>();
    const topicIds = new Set<string>();

    for (const item of items) {
        if (!item.skillId) {
            throw new AppError("Every roadmap item requires a skillId",400);
        }

        if (!mongoose.isValidObjectId(item.skillId)) {
            throw new AppError("Invalid skill ID in roadmap item",400);
        }

        skillIds.add(item.skillId.toString());

        if(item.topicId && !mongoose.isValidObjectId(item.topicId)) {
            throw new AppError("Invalid Topic Id in roadmap item", 400);
        }

        if(item.topicId) {
            topicIds.add(item.topicId.toString());
        }

        if(!Number.isInteger(item.order) || item.order < 0) {
            throw new AppError("Roadmap item order must be a non-negative integer", 400);
        } 
    }

    const skills = await Skill.find({
        _id: {$in: [...skillIds]},
        isActive: true,
    }).select("_id");

    if(skills.length !== skillIds.size) {
        throw new AppError("One or more skills do not exist or are inactive", 404);
    }

    if (topicIds.size === 0) {
        return;
    }

    const topics = await Topic.find({
        _id: {$in: [...topicIds]},
        isActive: true,
    }).select("_id skillId");

    if (topics.length !== topicIds.size) {
        throw new AppError("One or more topics do not exist or are inactive",404);
    }

    const topicMap = new Map(
        topics.map((topic) => [
            topic._id.toString(),
            topic.skillId.toString(),
        ])
    );

    for (const item of items) {
        if (!item.topicId) {
            continue;
        }

        const topicSkillId = topicMap.get(item.topicId.toString());

        if(topicSkillId !== item.skillId.toString()) {
            throw new AppError("Topic does not belong to the specified skill", 400);
        }
    }
}
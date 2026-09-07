import LearningProgress, {
    type ILearningProgress,
} from "../models/LearningProgress.js";

import Skill from "../models/Skill.js";
import Topic from "../models/Topic.js";

import { AppError } from "../utils/AppError.js";
import { createLearningActivity } from "./learningActivity.service.js";

export const updateLearningProgress = async (
    userId: string,
    skillId: string,
    topicId: string | undefined,
    progress: number
): Promise<ILearningProgress> => {

    if (!Number.isFinite(progress) || progress < 0 || progress > 100) {
        throw new AppError("Progress must be between 0 and 100",400);
    }

    const skill = await Skill.findOne({
        _id: skillId,
        isActive: true,
    });

    if (!skill) {
        throw new AppError("Skill not found",404);
    }

    if (topicId) {

        const topic = await Topic.findOne({
            _id: topicId,
            skillId,
            isActive: true,
        });

        if (!topic) {
            throw new AppError("Topic not found for this skill",404);
        }
    }

    let status:
        | "not-started"
        | "in-progress"
        | "completed";

    if (progress === 0) {
        status = "not-started";
    } else if (progress === 100) {
        status = "completed";
    } else {
        status = "in-progress";
    }

        const filter: Record<string, unknown> = {
        userId,
        skillId,
    };
    if (topicId) {
        filter.topicId = topicId;
    } else {
        filter.topicId = { $exists: false };
    }

    const existingProgress =
        await LearningProgress.findOne(filter);

    const update: Record<string, unknown> = {
        progress,
        status,
    };

    if (
        progress > 0 &&
        !existingProgress?.startedAt
    ) {
        update.startedAt = new Date();
    }

    if (progress === 100) {
        update.completedAt =
            existingProgress?.completedAt ?? new Date();
    } else {
        update.completedAt = null;
    }

    const learningProgress =
        await LearningProgress.findOneAndUpdate(
            filter,
            update,
            {
                upsert: true,
                returnDocument: "after",
                runValidators: true,
            }
        );

    const justCompleted =
        progress === 100 &&
        existingProgress?.status !== "completed";

    if (justCompleted && !topicId) {
        await createLearningActivity(userId, {
            type: "skill-completed",
            skillId,
        });
    } else if (
        progress > 0 &&
        progress !== existingProgress?.progress &&
        !topicId
    ) {
        await createLearningActivity(userId, {
            type: "learning",
            skillId,
            metadata: { progress },
        });
    }

    return learningProgress;
};

export const getUserLearningProgress = async (
    userId: string
): Promise<ILearningProgress[]> => {

    return LearningProgress.find({
        userId,
    })
    .populate("skillId", "name slug domain")
    .populate("topicId", "name slug")
    .sort({ updatedAt: -1 });
};

export const getSkillLearningProgress = async (
    userId: string,
    skillId: string
): Promise<ILearningProgress[]> => {

    return LearningProgress.find({
        userId,
        skillId,
    })
    .populate("skillId", "name slug domain")
    .populate("topicId", "name slug")
    .sort({ topicId: 1 });
};

export const getTopicLearningProgress = async (
    userId: string,
    skillId: string
): Promise<ILearningProgress[]> => {

    return LearningProgress.find({
        userId,
        skillId,
        topicId: {
            $exists: true,
        },
    })
    .populate("topicId", "name slug")
    .sort({ updatedAt: -1 });
};


export const getProgressSummary = async (
    userId: string
) => {
    const progressRecords = await LearningProgress.find({
        userId,
    });

    const totalRecords = progressRecords.length;

    const completed = progressRecords.filter(
        (item) => item.status === "completed"
    ).length;

    const inProgress = progressRecords.filter(
        (item) => item.status === "in-progress"
    ).length;

    const notStarted = progressRecords.filter(
        (item) => item.status === "not-started"
    ).length;

    const totalProgress = progressRecords.reduce(
        (sum, item) => sum + item.progress,
        0
    );

    const overallProgress =
        totalRecords === 0
            ? 0
            : Math.round(totalProgress / totalRecords);

    return {
        overallProgress,
        totalItems: totalRecords,
        completedItems: completed,
        inProgressItems: inProgress,
        notStartedItems: notStarted,
    };
};

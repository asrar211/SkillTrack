import LearningActivity, {
    type ActivityType,
    type ILearningActivity,
} from "../models/LearningActivity.js";

export const createLearningActivity = async (
    userId: string,
    data: {
        type: ActivityType;
        skillId?: string;
        problemId?: string;
        minutes?: number;
        metadata?: Record<string, unknown>;
    }
): Promise<ILearningActivity> => {

    return LearningActivity.create({
        userId,
        ...data,
    });
};

export const getLearningActivity = async (
    userId: string,
    limit = 20
): Promise<ILearningActivity[]> => {

    return LearningActivity.find({
        userId,
    })
        .populate("skillId", "name slug")
        .populate(
            "problemId",
            "title slug platform problemUrl"
        )
        .sort({
            createdAt: -1,
        })
        .limit(limit);
};
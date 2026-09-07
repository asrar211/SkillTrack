import Roadmap from "../models/Roadmap.js";
import LearningProgress from "../models/LearningProgress.js";
import DailyGoal from "../models/DailyGoals.js";
import DSAProgress from "../models/DSAProgress.js";

import {
    getUserStreak,
} from "./dailyGoal.service.js";

import {
    getLearningRecommendations,
} from "./recommendation.service.js";

export const getDashboard = async (
    userId: string
) => {

    const [
        roadmaps,
        progress,
        dailyGoal,
        dsaProgress,
        streak,
        recommendations,
    ] = await Promise.all([
        Roadmap.find({ userId })
            .sort({ createdAt: -1 }),

        LearningProgress.find({ userId }),

        DailyGoal.findOne({
            userId,
            date: {
                $gte: new Date(
                    new Date().setHours(
                        0, 0, 0, 0
                    )
                ),
                $lt: new Date(
                    new Date().setHours(
                        23, 59, 59, 999
                    )
                ),
            },
        }),

        DSAProgress.find({ userId }),

        getUserStreak(userId),

        getLearningRecommendations(userId),
    ]);

    const totalProgress =
        progress.reduce(
            (sum, item) =>
                sum + item.progress,
            0
        );

    const overallProgress =
        progress.length === 0
            ? 0
            : Math.round(
                totalProgress /
                progress.length
            );

    const completedSkills =
        progress.filter(
            (item) =>
                item.status === "completed" &&
                !item.topicId
        ).length;

    const solvedDSA =
        dsaProgress.filter(
            (item) =>
                item.status === "solved"
        ).length;

    return {
        overview: {
            overallProgress,
            completedSkills,
            solvedDSA,
            roadmapCount: roadmaps.length,
        },

        dailyGoal,

        streak,

        recommendations,

        roadmaps,
    };
};
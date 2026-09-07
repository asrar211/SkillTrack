import DailyGoal, { IDailyGoal } from "../models/DailyGoals.js";
import { AppError } from "../utils/AppError.js";
import { startOfDay } from "../utils/date.js";
import { createLearningActivity } from "./learningActivity.service.js";

export const createDailyGoal = async (
    userId: string,
    targetMinutes: number,
    date = new Date()
): Promise<IDailyGoal> => {

    if (!Number.isInteger(targetMinutes) || targetMinutes <= 0) {
        throw new AppError("Target minutes must be a positive integer",400);
    }

    const normalizeDate = startOfDay(date);

    const existingGoal = await DailyGoal.findOne({userId, date: normalizeDate});

    if(existingGoal){
        throw new AppError("A daily goal already exists fro this date", 409);
    }

    return DailyGoal.create({
        userId,
        date: normalizeDate,
        targetMinutes,
        completedMinutes: 0,
        completed: false
    })
}

export const updateDailyGoalProgress = async (
    userId: string,
    completedMinutes: number,
    date = new Date()
): Promise<IDailyGoal> => {

    if (!Number.isInteger(completedMinutes) || completedMinutes < 0) {
        throw new AppError("Completed minutes must be a non-negative integer",400);
    }

    const normalizedDate = startOfDay(date);

    const goal = await DailyGoal.findOne({
        userId,
        date: normalizedDate,
    });

    if (!goal) {
        throw new AppError("Daily goal not found",404);
    }

    const wasCompleted = goal.completed;

    goal.completedMinutes = completedMinutes;

    goal.completed =
        completedMinutes >= goal.targetMinutes;

    const updatedGoal = await goal.save();

    if (updatedGoal.completed && !wasCompleted) {
        await createLearningActivity(userId, {
            type: "goal-completed",
            minutes: completedMinutes,
        });
    }

    return updatedGoal;
};

export const getTodayDailyGoal = async (
    userId: string
): Promise<IDailyGoal | null> => {

    return DailyGoal.findOne({
        userId,
        date: startOfDay(),
    });
};

export const getUserStreak = async (
    userId: string
) => {
    const goals = await DailyGoal.find({
        userId,
        completed: true,
    })
    .sort({ date: -1 })
    .select("date");

    if (goals.length === 0) {
        return {
            currentStreak: 0,
            longestStreak: 0,
            totalCompletedDays: 0,
        };
    }

    const completedDates = goals.map(
        (goal) => startOfDay(goal.date).getTime()
    );

    const uniqueDates = [
        ...new Set(completedDates),
    ];

    const DAY = 24 * 60 * 60 * 1000;

    let currentStreak = 0;
    let longestStreak = 0;
    let streak = 0;

    for (let i = 0; i < uniqueDates.length; i++) {
        if (i === 0 || uniqueDates[i - 1] - uniqueDates[i] === DAY) {
            streak++;
        } else {
            streak = 1;
        }

        longestStreak = Math.max(
            longestStreak,
            streak
        );
    }

    const today = startOfDay().getTime();
    const yesterday = today - DAY;

    if ( uniqueDates[0] === today || uniqueDates[0] === yesterday
    ) {
        currentStreak = 1;

        for (let i = 1; i < uniqueDates.length; i++) {
            if ( uniqueDates[i - 1] - uniqueDates[i] === DAY ) {
                currentStreak++;
            } else {
                break;
            }
        }
    }

    return {
        currentStreak,
        longestStreak,
        totalCompletedDays: uniqueDates.length,
    };
};

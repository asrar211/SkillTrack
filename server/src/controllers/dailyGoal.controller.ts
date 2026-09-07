import type { Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { createDailyGoal, getTodayDailyGoal, getUserStreak, updateDailyGoalProgress } from "../services/dailyGoal.service.js";


export const createDailyGoalController = async (
    req: Request,
    res: Response
): Promise<void> => {

    const userId = req.userId;

    if (!userId) {
        throw new AppError("Authentication required",401);
    }

    const { targetMinutes } = req.body;

    if (typeof targetMinutes !== "number") {
        throw new AppError("targetMinutes is required",400);
    }

    const goal = await createDailyGoal(
        userId,
        targetMinutes
    );

    res.status(201).json({
        success: true,
        message: "Daily goal created successfully",
        data: goal,
    });
};


export const getTodayDailyGoalController = async (
    req: Request,
    res: Response
): Promise<void> => {

    const userId = req.userId;

    if (!userId) {
        throw new AppError("Authentication required",401);
    }

    const goal = await getTodayDailyGoal(userId);

    res.status(200).json({
        success: true,
        data: goal,
    });
};

export const updateDailyGoalProgressController =
    async (
        req: Request,
        res: Response
    ): Promise<void> => {

        const userId = req.userId;

    if (!userId) {
        throw new AppError("Authentication required",401);
    }

        const { completedMinutes } = req.body;

        if (typeof completedMinutes !== "number") {
            throw new AppError("completedMinutes is required",400);
        }

        const goal =
            await updateDailyGoalProgress(
                userId,
                completedMinutes
            );

        res.status(200).json({
            success: true,
            message: "Daily goal progress updated successfully",
            data: goal,
        });
};

export const getUserStreakController = async (
    req: Request,
    res: Response
): Promise<void> => {

    const userId = req.userId;

    if (!userId) {
        throw new AppError("Authentication required",401);
    }

    const streak = await getUserStreak(userId);

    res.status(200).json({
        success: true,
        data: streak,
    });
};
import type { Request, Response } from "express";

import {
    getLearningActivity,
} from "../services/learningActivity.service.js";

import { AppError } from "../utils/AppError.js";

export const getLearningActivityController =
    async (
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

        const rawLimit = req.query.limit;

        const limit =
            typeof rawLimit === "string"
                ? Number(rawLimit)
                : 20;

        if (
            !Number.isInteger(limit) ||
            limit < 1 ||
            limit > 100
        ) {
            throw new AppError(
                "Limit must be between 1 and 100",
                400
            );
        }

        const activity =
            await getLearningActivity(
                userId,
                limit
            );

        res.status(200).json({
            success: true,
            data: activity,
        });
    };
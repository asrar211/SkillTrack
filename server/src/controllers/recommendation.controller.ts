import type { Request, Response } from "express";

import {
    getLearningRecommendations,
} from "../services/recommendation.service.js";

import { AppError } from "../utils/AppError.js";

export const getLearningRecommendationsController =
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

        const recommendations =
            await getLearningRecommendations(
                userId
            );

        res.status(200).json({
            success: true,
            data: recommendations,
        });
};
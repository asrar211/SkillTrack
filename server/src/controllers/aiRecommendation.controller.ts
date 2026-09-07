import type { Request, Response } from "express";

import {
    generateAIRecommendations,
} from "../services/aiRecommendation.service.js";

import { AppError } from "../utils/AppError.js";

export const getAIRecommendationsController =
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

        const result =
            await generateAIRecommendations(
                userId
            );

        res.status(200).json({
            success: true,
            data: result,
        });
};
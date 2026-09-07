import type { Request, Response } from "express";

import { getProgressSummary, getSkillLearningProgress, getTopicLearningProgress, getUserLearningProgress, updateLearningProgress } from "../services/learningProgress.service.js";

import { AppError } from "../utils/AppError.js";
import { isValidObjectId } from "../utils/validation.js";

export const updateLearningProgressController =
    async (
        req: Request,
        res: Response
    ): Promise<void> => {

        const userId = req.userId;

        if (!userId) {
            throw new AppError("Authentication required",401);
        }

        const {skillId, topicId, progress} = req.body;

        if (
            typeof skillId !== "string" ||
            typeof progress !== "number"
        ) {
            throw new AppError("skillId and progress are required",400);
        }

        if (!isValidObjectId(skillId)) {
            throw new AppError("Invalid Skill ID",400);
        }

        if (
            topicId !== undefined &&
            ( typeof topicId !== "string" || !isValidObjectId(topicId))
        ) {
            throw new AppError("Invalid Topic ID",400);
        }

        const result =
            await updateLearningProgress(
                userId,
                skillId,
                topicId,
                progress
            );

        res.status(200).json({
            success: true,
            message: "Learning progress updated successfully",
            data: result,
        });
};

export const getUserLearningProgressController = async (
    req: Request,
    res: Response
): Promise<void> => {

    const userId = req.userId;

    if (!userId) {
        throw new AppError("Authentication required",401);
    }

    const progress = await getUserLearningProgress(
        userId
    );

    res.status(200).json({
        success: true,
        data: progress,
    });
};


export const getSkillLearningProgressController =
    async (
        req: Request,
        res: Response
    ): Promise<void> => {

        const userId = req.userId;

        if (!userId) {
            throw new AppError("Authentication required",401);
        }

        const { skillId } =
            req.params as { skillId: string };

        if (!isValidObjectId(skillId)) {
            throw new AppError("Invalid Skill ID",400);
        }

        const progress =
            await getSkillLearningProgress(
                userId,
                skillId
            );

        res.status(200).json({
            success: true,
            data: progress,
        });
};


export const getTopicLearningProgressController =
    async (
        req: Request,
        res: Response
    ): Promise<void> => {

        const userId = req.userId;

        if (!userId) {
            throw new AppError("Authentication required",401);
        }

        const { skillId } =
            req.params as { skillId: string };

        if (!isValidObjectId(skillId)) {
            throw new AppError("Invalid Skill ID",400);
        }

        const progress =
            await getTopicLearningProgress(
                userId,
                skillId
            );

        res.status(200).json({
            success: true,
            data: progress,
        });
};


export const getProgressSummaryController =
    async (
        req: Request,
        res: Response
    ): Promise<void> => {

        const userId = req.userId;

        if (!userId) {
            throw new AppError("Authentication required",401);
        }

        const summary =
            await getProgressSummary(userId);

        res.status(200).json({
            success: true,
            data: summary,
        });
    };
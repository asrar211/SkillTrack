import type { Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { isValidObjectId } from "mongoose";
import { getDSASummary, getUserDSAProgress, updateDSAProgress } from "../services/dsaProgress.service.js";


export const updateDSAProgressController =
    async (
        req: Request,
        res: Response
    ): Promise<void> => {

        const userId = req.userId;

        if (!userId) {
            throw new AppError("Authentication required",401);
        }

        const {
            problemId,
            status,
            attempts,
            notes,
        } = req.body;

        if (
            typeof problemId !== "string" ||
            typeof status !== "string"
        ) {
            throw new AppError("problemId and status are required",400);
        }

        if (!isValidObjectId(problemId)) {
            throw new AppError("Invalid DSA problem ID",400);
        }

        const progress = await updateDSAProgress(
            userId,
            problemId,
            status as "not-started" | "attempted" | "solved",
            attempts,
            notes
        );

        res.status(200).json({
            success: true,
            message: "DSA progress updated successfully",
            data: progress,
        });
};

export const getUserDSAProgressController =
    async (
        req: Request,
        res: Response
    ): Promise<void> => {

        const userId = req.userId;

        if (!userId) {
            throw new AppError("Authentication required",401);
        }

        const progress = await getUserDSAProgress(userId);

        res.status(200).json({
            success: true,
            data: progress,
        });
};

export const getDSASummaryController =
    async (
        req: Request,
        res: Response
    ): Promise<void> => {

        const userId = req.userId;

        if (!userId) {
            throw new AppError("Authentication required",401);
        }

        const summary =
            await getDSASummary(userId);

        res.status(200).json({
            success: true,
            data: summary,
        });
};
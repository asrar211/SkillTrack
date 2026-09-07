import type { Request, Response } from "express";

import { getDashboard } from "../services/dashboard.service.js";
import { AppError } from "../utils/AppError.js";

export const getDashboardController = async (
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

    const dashboard =
        await getDashboard(userId);

    res.status(200).json({
        success: true,
        data: dashboard,
    });
};
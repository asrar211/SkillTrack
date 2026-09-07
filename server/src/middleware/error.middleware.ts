import type {
    NextFunction,
    Request,
    Response,
} from "express";

import mongoose from "mongoose";

import { AppError } from "../utils/AppError.js";

export const errorMiddleware = (
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {

    console.error(error);

    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });

        return;
    }

    if (
        error instanceof mongoose.Error.ValidationError
    ) {
        res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: Object.values(
                error.errors
            ).map(
                (item) => item.message
            ),
        });

        return;
    }

    if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === 11000
    ) {
        res.status(409).json({
            success: false,
            message: "Duplicate value",
        });

        return;
    }

    res.status(500).json({
        success: false,
        message: "Internal server error",
    });
};
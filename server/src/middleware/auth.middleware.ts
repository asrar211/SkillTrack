import type {
    Request,
    Response,
    NextFunction,
} from "express";

import jwt from "jsonwebtoken";

import { AppError } from "../utils/AppError.js";
import { isValidObjectId } from "../utils/validation.js";

const JWT_SECRET = process.env.JWT_SECRET;

interface TokenPayload {
    userId: string;
}

export const authMiddleware = (
    req: Request,
    _res: Response,
    next: NextFunction
): void => {
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }

    const authorization = req.get("authorization");
    const bearerToken = authorization?.startsWith("Bearer ")
        ? authorization.slice("Bearer ".length).trim()
        : undefined;
    const token = req.cookies?.token ?? bearerToken;

    if (!token) {
        throw new AppError(
            "Authentication required",
            401
        );
    }

    try {
        const decoded = jwt.verify(
            token,
            JWT_SECRET
        );

        if (
            typeof decoded !== "object" ||
            decoded === null ||
            !("userId" in decoded)
        ) {
            throw new AppError(
                "Invalid authentication token",
                401
            );
        }

        const userId = decoded.userId;

        if (
            typeof userId !== "string" ||
            !isValidObjectId(userId)
        ) {
            throw new AppError(
                "Invalid authentication token",
                401
            );
        }

        req.userId = userId;

        next();
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError(
            "Invalid or expired token",
            401
        );
    }
};

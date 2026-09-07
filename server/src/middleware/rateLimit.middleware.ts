import rateLimit from "express-rate-limit";

export const authRateLimiter =
    rateLimit({
        windowMs: 15 * 60 * 1000,

        limit: 1000,

        standardHeaders: "draft-8",

        legacyHeaders: false,

        message: {
            success: false,
            message:
                "Too many authentication attempts. Please try again later.",
        },
    });

export const aiRateLimiter =
    rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 12,
        standardHeaders: "draft-8",
        legacyHeaders: false,
        message: {
            success: false,
            message: "Too many AI coaching requests. Please try again in a few minutes.",
        },
    });

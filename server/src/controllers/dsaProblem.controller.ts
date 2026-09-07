import type { Request, Response } from "express";

import { createDSAProblem, getDSAProblemById, getDSAProblems} from "../services/dsaProblem.service.js";
import { AppError } from "../utils/AppError.js";
import { IDSAProblem } from "../models/DSAProblem.js";
import { isValidObjectId } from "../utils/validation.js";

export const createDSAProblemController = async (
    req: Request,
    res: Response
): Promise<void> => {

    const {
        title,
        slug,
        platform,
        difficulty,
        problemUrl,
        topics,
        description,
    } = req.body;

    if (
        typeof title !== "string" ||
        typeof slug !== "string" ||
        typeof platform !== "string" ||
        typeof difficulty !== "string" ||
        typeof problemUrl !== "string"
    ) {
        throw new AppError("title, slug, platform, difficulty and problemUrl are required",400);
    }

    try {
        new URL(problemUrl);
    } catch {
        throw new AppError("Invalid problem URL",400);
    }

    const problem = await createDSAProblem({
        title,
        slug,
        platform: platform as IDSAProblem["platform"],
        difficulty:
            difficulty as IDSAProblem["difficulty"],
        problemUrl,
        topics: Array.isArray(topics)
            ? topics
            : [],
        description,
    });

    res.status(201).json({
        success: true,
        message: "DSA problem created successfully",
        data: problem,
    });
};

export const getDSAProblemsController = async (
    req: Request,
    res: Response
): Promise<void> => {

    const {
        platform,
        difficulty,
        topic,
        search,
        page,
        limit,
    } = req.query;

    const parsedPage =
        page === undefined
            ? undefined
            : Number(page);

    const parsedLimit =
        limit === undefined
            ? undefined
            : Number(limit);

    if (
        parsedPage !== undefined &&
        (
            !Number.isInteger(parsedPage) ||
            parsedPage < 1
        )
    ) {
        throw new AppError(
            "Page must be a positive integer",
            400
        );
    }

    if (
        parsedLimit !== undefined &&
        (
            !Number.isInteger(parsedLimit) ||
            parsedLimit < 1 ||
            parsedLimit > 100
        )
    ) {
        throw new AppError(
            "Limit must be between 1 and 100",
            400
        );
    }

    const result = await getDSAProblems({
        platform:
            typeof platform === "string"
                ? platform
                : undefined,

        difficulty:
            typeof difficulty === "string"
                ? difficulty
                : undefined,

        topic:
            typeof topic === "string"
                ? topic
                : undefined,

        search:
            typeof search === "string"
                ? search
                : undefined,

        page: parsedPage,
        limit: parsedLimit,
    });

    res.status(200).json({
        success: true,
        data: result.problems,
        pagination: result.pagination,
    });
};

export const getDSAProblemByIdController =
    async (
        req: Request,
        res: Response
    ): Promise<void> => {

        const { id } =
            req.params as { id: string };

        if (!isValidObjectId(id)) {
            throw new AppError("Invalid DSA problem ID",400);
        }

        const problem =
            await getDSAProblemById(id);

        if (!problem) {
            throw new AppError("DSA problem not found",404);
        }

        res.status(200).json({
            success: true,
            data: problem,
        });
};

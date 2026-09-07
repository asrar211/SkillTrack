import type { Request, Response } from "express";

import {
    createDSATopic,
    getDSATopics,
} from "../services/dsaTopic.service.js";

import { AppError } from "../utils/AppError.js";

export const createDSATopicController = async (
    req: Request,
    res: Response
): Promise<void> => {

    const {
        name,
        slug,
        description,
    } = req.body;

    if (
        typeof name !== "string" ||
        typeof slug !== "string"
    ) {
        throw new AppError(
            "name and slug are required",
            400
        );
    }

    const topic = await createDSATopic({
        name,
        slug,
        description,
    });

    res.status(201).json({
        success: true,
        message: "DSA topic created successfully",
        data: topic,
    });
};


export const getDSATopicsController = async (
    _req: Request,
    res: Response
): Promise<void> => {

    const topics = await getDSATopics();

    res.status(200).json({
        success: true,
        data: topics,
    });
};
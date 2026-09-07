import DSAProblem, {
    type IDSAProblem,
} from "../models/DSAProblem.js";

import DSATopic from "../models/DSATopic.js";

import { AppError } from "../utils/AppError.js";


export const createDSAProblem = async (
    data: Pick<
        IDSAProblem,
        | "title"
        | "slug"
        | "platform"
        | "difficulty"
        | "problemUrl"
        | "topics"
        | "description"
    >
): Promise<IDSAProblem> => {

    if (data.topics.length > 0) {

        const topics = await DSATopic.find({
            _id: {
                $in: data.topics,
            },
            isActive: true,
        }).select("_id");

        if (topics.length !== data.topics.length) {
            throw new AppError(
                "One or more DSA topics do not exist or are inactive",
                404
            );
        }
    }

    try {
        return await DSAProblem.create(data);

    } catch (error) {

        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === 11000
        ) {
            throw new AppError(
                "A DSA problem with this slug already exists",
                409
            );
        }

        throw error;
    }
};


export const getDSAProblems = async (
    filters: {
        platform?: string;
        difficulty?: string;
        topic?: string;
        search?: string;
        page?: number;
        limit?: number;
    }
) => {

    const page = Math.max(
        filters.page ?? 1,
        1
    );

    const limit = Math.min(
        Math.max(filters.limit ?? 20, 1),
        100
    );

    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};

    if (filters.platform) {
        query.platform = filters.platform;
    }

    if (filters.difficulty) {
        query.difficulty = filters.difficulty;
    }

    if (filters.topic) {
        query.topics = filters.topic;
    }

    if (filters.search) {
        query.$or = [
            {
                title: {
                    $regex: filters.search,
                    $options: "i",
                },
            },
            {
                slug: {
                    $regex: filters.search,
                    $options: "i",
                },
            },
        ];
    }

    const [problems, total] = await Promise.all([
        DSAProblem.find(query)
            .populate(
                "topics",
                "name slug description"
            )
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),

        DSAProblem.countDocuments(query),
    ]);

    return {
        problems,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page * limit < total,
            hasPreviousPage: page > 1,
        },
    };
};


export const getDSAProblemById = async (
    id: string
): Promise<IDSAProblem | null> => {

    return DSAProblem.findById(id)
        .populate(
            "topics",
            "name slug description"
        );
};
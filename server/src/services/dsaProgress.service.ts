import DSAProblem from "../models/DSAProblem.js";
import DSAProgress, { IDSAProgress } from "../models/DSAProgress.js";
import { AppError } from "../utils/AppError.js";
import { createLearningActivity } from "./learningActivity.service.js";

export const updateDSAProgress = async (
    userId: string,
    problemId: string,
    status: IDSAProgress["status"],
    attempts?: number,
    notes?: string
): Promise<IDSAProgress> => {

    const problem = await DSAProblem.findById(problemId);

    if (!problem) {
        throw new AppError(
            "DSA problem not found",
            404
        );
    }

    const validStatuses = [
        "not-started",
        "attempted",
        "solved",
    ];

    if (!validStatuses.includes(status)) {
        throw new AppError(
            "Invalid DSA progress status",
            400
        );
    }

    if (
        attempts !== undefined &&
        (
            !Number.isInteger(attempts) ||
            attempts < 0
        )
    ) {
        throw new AppError(
            "Attempts must be a non-negative integer",
            400
        );
    }

    const existing = await DSAProgress.findOne({
        userId,
        problemId,
    });

    const wasAlreadySolved =
        existing?.status === "solved";

    const update: Record<string, unknown> = {
        status,
    };

    if (attempts !== undefined) {
        update.attempts = attempts;
    }

    if (notes !== undefined && typeof notes !== "string") {
        throw new AppError(
            "Notes must be a string",
            400
        );
    }

    if (notes !== undefined) {
        update.notes = notes.trim();
    }

    if (status === "solved") {

        update.solvedAt =
            existing?.solvedAt ?? new Date();

        if (
            attempts === undefined &&
            !existing?.attempts
        ) {
            update.attempts = 1;
        }

    } else {

        update.solvedAt = null;
    }

    const progress =
        await DSAProgress.findOneAndUpdate(
            {
                userId,
                problemId,
            },
            update,
            {
                upsert: true,
                returnDocument: "after",
                runValidators: true,
            }
        );

    if (
        status === "solved" &&
        !wasAlreadySolved
    ) {
        await createLearningActivity(
            userId,
            {
                type: "dsa-solved",
                problemId,
            }
        );
    }

    return progress;
};

export const getUserDSAProgress = async (
    userId: string
): Promise<IDSAProgress[]> => {

    return DSAProgress.find({
        userId,
    })
    .populate( "problemId", "title slug platform difficulty problemUrl topics")
    .sort({ updatedAt: -1 });
};

export const getDSASummary = async (
    userId: string
) => {

    const progress = await DSAProgress.find({
        userId,}).populate( "problemId", "difficulty");

    const summary = {
        total: progress.length,

        solved: 0,
        attempted: 0,
        notStarted: 0,

        easy: {
            total: 0,
            solved: 0,
        },

        medium: {
            total: 0,
            solved: 0,
        },

        hard: {
            total: 0,
            solved: 0,
        },
    };

    for (const item of progress) {

        if (item.status === "solved") {
            summary.solved++;
        }

        if (item.status === "attempted") {
            summary.attempted++;
        }

        if (item.status === "not-started") {
            summary.notStarted++;
        }

        const problem = item.problemId as unknown as {
            difficulty: "easy" | "medium" | "hard";
        };

        if (!problem?.difficulty) {
            continue;
        }

        summary[problem.difficulty].total++;

        if (item.status === "solved") {
            summary[problem.difficulty].solved++;
        }
    }

    return summary;
};

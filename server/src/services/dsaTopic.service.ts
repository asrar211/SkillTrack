import DSATopic, {
    type IDSATopic,
} from "../models/DSATopic.js";

import { AppError } from "../utils/AppError.js";

export const createDSATopic = async (
    data: Pick<
        IDSATopic,
        "name" | "slug" | "description"
    >
): Promise<IDSATopic> => {

    try {
        return await DSATopic.create(data);
    } catch (error) {

        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === 11000
        ) {
            throw new AppError(
                "A DSA topic with this slug already exists",
                409
            );
        }

        throw error;
    }
};

export const getDSATopics = async (): Promise<IDSATopic[]> => {

    return DSATopic.find({
        isActive: true,
    }).sort({
        name: 1,
    });
};
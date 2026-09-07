import mongoose, { Document, Schema } from "mongoose";

export type DSAPlatform =
    | "leetcode"
    | "codeforces"
    | "codechef"
    | "geeksforgeeks"
    | "hackerrank"
    | "atcoder"
    | "other";

export type DSADifficulty =
    | "easy"
    | "medium"
    | "hard";

export interface IDSAProblem extends Document {
    title: string;
    slug: string;
    platform: DSAPlatform;
    difficulty: DSADifficulty;
    problemUrl: string;
    topics: mongoose.Types.ObjectId[];
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const dsaProblemSchema = new Schema<IDSAProblem>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },

        platform: {
            type: String,
            enum: [
                "leetcode",
                "codeforces",
                "codechef",
                "geeksforgeeks",
                "hackerrank",
                "atcoder",
                "other",
            ],
            required: true,
        },

        difficulty: {
            type: String,
            enum: [
                "easy",
                "medium",
                "hard",
            ],
            required: true,
        },

        problemUrl: {
            type: String,
            required: true,
            trim: true,
        },

        topics: [{
            type: Schema.Types.ObjectId,
            ref: "DSATopic",
        }],

        description: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const DSAProblem = mongoose.model<IDSAProblem>(
    "DSAProblem",
    dsaProblemSchema
);

export default DSAProblem;
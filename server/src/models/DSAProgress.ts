import mongoose, { Document, Schema } from "mongoose";

export type DSAProgressStatus =
    | "not-started"
    | "attempted"
    | "solved";

export interface IDSAProgress extends Document {
    userId: mongoose.Types.ObjectId;
    problemId: mongoose.Types.ObjectId;
    status: DSAProgressStatus;
    attempts: number;
    notes?: string;
    solvedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const dsaProgressSchema = new Schema<IDSAProgress>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        problemId: {
            type: Schema.Types.ObjectId,
            ref: "DSAProblem",
            required: true,
        },

        status: {
            type: String,
            enum: [
                "not-started",
                "attempted",
                "solved",
            ],
            default: "not-started",
        },

        attempts: {
            type: Number,
            min: 0,
            default: 0,
        },

        notes: {
            type: String,
            trim: true,
        },

        solvedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

dsaProgressSchema.index(
    {
        userId: 1,
        problemId: 1,
    },
    {
        unique: true,
    }
);

dsaProgressSchema.index({
    userId: 1,
    status: 1,
});

const DSAProgress = mongoose.model<IDSAProgress>(
    "DSAProgress",
    dsaProgressSchema
);

export default DSAProgress;
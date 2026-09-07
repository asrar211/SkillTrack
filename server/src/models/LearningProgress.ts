import mongoose, { Document, Schema } from "mongoose";

export type ProgressStatus =
    | "not-started"
    | "in-progress"
    | "completed";

export interface ILearningProgress extends Document {
    userId: mongoose.Types.ObjectId;
    skillId: mongoose.Types.ObjectId;
    topicId?: mongoose.Types.ObjectId;
    status: ProgressStatus;
    progress: number;
    startedAt?: Date;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const learningProgressSchema =
    new Schema<ILearningProgress>(
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },

            skillId: {
                type: Schema.Types.ObjectId,
                ref: "Skill",
                required: true,
            },

            topicId: {
                type: Schema.Types.ObjectId,
                ref: "Topic",
            },

            status: {
                type: String,
                enum: [
                    "not-started",
                    "in-progress",
                    "completed",
                ],
                default: "not-started",
            },

            progress: {
                type: Number,
                min: 0,
                max: 100,
                default: 0,
            },

            startedAt: {
                type: Date,
            },

            completedAt: {
                type: Date,
            },
        },
        {
            timestamps: true,
        }
    );

learningProgressSchema.index(
    {
        userId: 1,
        skillId: 1,
        topicId: 1,
    },
    {
        unique: true,
        partialFilterExpression: {
            topicId: { $exists: true },
        },
    }
);

learningProgressSchema.index(
    {
        userId: 1,
        skillId: 1,
    },
    {
        unique: true,
        partialFilterExpression: {
            topicId: { $exists: false },
        },
    }
);

learningProgressSchema.index({
    userId: 1,
    status: 1,
});

const LearningProgress =
    mongoose.model<ILearningProgress>(
        "LearningProgress",
        learningProgressSchema
    );

export default LearningProgress;
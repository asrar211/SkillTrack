import mongoose, { Document, Schema } from "mongoose";

export type ActivityType =
    | "learning"
    | "skill-completed"
    | "dsa-solved"
    | "goal-completed";

export interface ILearningActivity extends Document {
    userId: mongoose.Types.ObjectId;
    type: ActivityType;
    skillId?: mongoose.Types.ObjectId;
    problemId?: mongoose.Types.ObjectId;
    minutes?: number;
    metadata?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}

const learningActivitySchema =
    new Schema<ILearningActivity>(
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },

            type: {
                type: String,
                enum: [
                    "learning",
                    "skill-completed",
                    "dsa-solved",
                    "goal-completed",
                ],
                required: true,
            },

            skillId: {
                type: Schema.Types.ObjectId,
                ref: "Skill",
            },

            problemId: {
                type: Schema.Types.ObjectId,
                ref: "DSAProblem",
            },

            minutes: {
                type: Number,
                min: 0,
            },

            metadata: {
                type: Schema.Types.Mixed,
            },
        },
        {
            timestamps: true,
        }
    );

learningActivitySchema.index({
    userId: 1,
    createdAt: -1,
});

learningActivitySchema.index({
    userId: 1,
    type: 1,
    createdAt: -1,
});

const LearningActivity =
    mongoose.model<ILearningActivity>(
        "LearningActivity",
        learningActivitySchema
    );

export default LearningActivity;
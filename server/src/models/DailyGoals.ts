import mongoose, {Document, Schema} from "mongoose";

export interface IDailyGoal extends Document {
    userId: mongoose.Types.ObjectId;
    date: Date;
    targetMinutes: number;
    completedMinutes: number;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const dailyGoalSchema = new Schema<IDailyGoal>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        date: {
            type: Date,
            required: true,
        },

        targetMinutes: {
            type: Number,
            required: true,
            min: 1,
        },

        completedMinutes: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },

        completed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

dailyGoalSchema.index(
    {
        userId: 1,
        date: 1,
    },
    {
        unique: true,
    }
);

const DailyGoal = mongoose.model<IDailyGoal>(
    "DailyGoal",
    dailyGoalSchema
);

export default DailyGoal;
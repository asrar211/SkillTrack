import mongoose, { Document, Schema } from "mongoose";

export interface IDSATopic extends Document {
    name: string;
    slug: string;
    description?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const dsaTopicSchema = new Schema<IDSATopic>(
    {
        name: {
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

        description: {
            type: String,
            trim: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const DSATopic = mongoose.model<IDSATopic>(
    "DSATopic",
    dsaTopicSchema
);

export default DSATopic;
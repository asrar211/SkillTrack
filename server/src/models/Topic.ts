import mongoose, {Document, Schema} from "mongoose";

export interface ITopic extends Document {
    skillId: mongoose.Types.ObjectId;
    name: string;
    slug: string;
    description?: string;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const topicSchema = new Schema<ITopic>({
    skillId: {
        type: Schema.Types.ObjectId,
        ref: "Skill",
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    order: {
        type: Number,
        required: true,
        min: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {timestamps: true});

topicSchema.index(
    {skillId: 1, slug: 1},
    {unique: true}
)

topicSchema.index(
    {skillId: 1, isActive: 1,  order: 1}
)

const Topic = mongoose.model<ITopic>("Topic", topicSchema);

export default Topic;
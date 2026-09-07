import mongoose, {Document, Schema} from "mongoose";


export interface IRoadmapItem  {
    _id?: mongoose.Types.ObjectId;
    skillId: mongoose.Types.ObjectId;
    topicId?: mongoose.Types.ObjectId;
    order: number;
    priority: "low" | "medium" | "high";
    estimatedMinutes: number;
    targetDate?: Date;
    notes?: string;
}

export interface IRoadmap extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    items: IRoadmapItem[];
    createdAt: Date;
    updatedAt: Date;
}

const roadmapItemSchema = new Schema<IRoadmapItem>({
    skillId: {
        type: Schema.Types.ObjectId,
        ref: "Skill",
        required: true
    },
    topicId: {
        type: Schema.Types.ObjectId,
        ref: "Topic"
    },
    order: {
        type: Number,
        required: true,
        min: 0
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium"
    },
    estimatedMinutes: {
        type: Number,
        min: 0,
        default: 0,
    },

    targetDate: {
        type: Date,
    },

    notes: {
        type: String,
        trim: true,
    },
}, {_id: true});

const roadmapSchema = new Schema<IRoadmap> ({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    items: {
        type: [roadmapItemSchema],
        default: []
    }
}, {timestamps: true});

const Roadmap = mongoose.model<IRoadmap>("Roadmap", roadmapSchema);

export default Roadmap;
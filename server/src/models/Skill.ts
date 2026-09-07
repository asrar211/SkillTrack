import mongoose, {Document, Schema} from "mongoose";

export type SkillDomain = "development" | "dsa" | "machine-learning" | "system-design";

export interface ISkill extends Document {
    name: string,
    slug: string,
    description?: string,
    domain: SkillDomain,
    icon?: string,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date
}

const skillSchema = new Schema<ISkill>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    domain: {
        type: String,
        enum: ["development", "dsa", "machine-learning", "system-design"],
        required: true
    },
    icon: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
}, {timestamps: true});

const Skill = mongoose.model<ISkill>("Skill", skillSchema);

export default Skill;
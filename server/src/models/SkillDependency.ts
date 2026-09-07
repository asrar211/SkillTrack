import mongoose, {
    Document,
    Schema,
} from "mongoose";

export interface ISkillDependency extends Document {
    prerequisiteSkillId: mongoose.Types.ObjectId;
    dependentSkillId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const skillDependencySchema =
    new Schema<ISkillDependency>(
        {
            prerequisiteSkillId: {
                type: Schema.Types.ObjectId,
                ref: "Skill",
                required: true,
            },

            dependentSkillId: {
                type: Schema.Types.ObjectId,
                ref: "Skill",
                required: true,
            },
        },
        {
            timestamps: true,
        }
    );

skillDependencySchema.index(
    {
        prerequisiteSkillId: 1,
        dependentSkillId: 1,
    },
    {
        unique: true,
    }
);

const SkillDependency =
    mongoose.model<ISkillDependency>(
        "SkillDependency",
        skillDependencySchema
    );

export default SkillDependency;

import Skill from "../models/Skill.js";
import SkillDependency, {type ISkillDependency} from "../models/SkillDependency.js";
import { AppError } from "../utils/AppError.js";

export const createSkillDependency = async (
    data: Pick<
        ISkillDependency,
        "prerequisiteSkillId" | "dependentSkillId"
    >
): Promise<ISkillDependency> => {

    const prerequisiteSkillId =
        data.prerequisiteSkillId.toString();

    const skillId =
        data.dependentSkillId.toString();

    // Prevent self dependency
    if (prerequisiteSkillId === skillId) {
        throw new AppError(
            "A Skill cannot depend on itself",
            400
        );
    }

    // Make sure both skills exist and are active
    const skills = await Skill.find({
        _id: {
            $in: [
                data.prerequisiteSkillId,
                data.dependentSkillId,
            ],
        },
        isActive: true,
    }).select("_id");

    if (skills.length !== 2) {
        throw new AppError(
            "Both skills must exist and be active",
            404
        );
    }

    // Prevent duplicate dependency
    const existingDependency =
        await SkillDependency.findOne({
            prerequisiteSkillId:
                data.prerequisiteSkillId,

            skillId:
                data.dependentSkillId,
        });

    if (existingDependency) {
        throw new AppError(
            "This skill dependency already exists",
            409
        );
    }

    // Check for dependency cycle
    const visited = new Set<string>();
    const stack = [skillId];

    while (stack.length > 0) {

        const currentSkillId = stack.pop();

        if (!currentSkillId) {
            continue;
        }

        if (
            currentSkillId ===
            prerequisiteSkillId
        ) {
            throw new AppError(
                "This dependency would create a cycle",
                400
            );
        }

        if (visited.has(currentSkillId)) {
            continue;
        }

        visited.add(currentSkillId);

        const dependencies =
            await SkillDependency.find({
                skillId: currentSkillId,
            }).select(
                "prerequisiteSkillId"
            );

        for (const dependency of dependencies) {
            stack.push(
                dependency.prerequisiteSkillId.toString()
            );
        }
    }

    return SkillDependency.create(data);
};

export const getSkillDependencies = async (): Promise<ISkillDependency[]> => {
    return SkillDependency.find()
    .populate("prerequisiteSkillId", "name slug domain")
    .populate("skillId", "name slug domain")
    .sort({createdAt: 1});
}

export const getPrerequisites = async (
    skillId: string
): Promise<ISkillDependency[]> => {
    return SkillDependency.find({
        skillId,
    }).populate("prerequisiteSkillId", "name slug domain")
    .sort({createdAt : 1});
}

export const getDependents = async (
    skillId: string
): Promise<ISkillDependency[]> => {
    return SkillDependency.find({
        prerequisiteSkillId: skillId,
    }).populate("skillId", "name slug domain")
    .sort({createdAt: 1});
}

const wouldCreateCycle = async (
    prerequisiteSkillId: string,
    dependentSkillId: string
): Promise<boolean> => {

    const visited = new Set<string>();

    const stack = [dependentSkillId];

    while (stack.length > 0) {

        const currentSkillId = stack.pop();

        if (!currentSkillId) {
            continue;
        }

        if (
            currentSkillId ===
            prerequisiteSkillId
        ) {
            return true;
        }

        if (visited.has(currentSkillId)) {
            continue;
        }

        visited.add(currentSkillId);

        const dependencies =
            await SkillDependency.find({
                dependentSkillId:
                    currentSkillId,
            }).select(
                "prerequisiteSkillId"
            );

        for (const dependency of dependencies) {

            stack.push(
                dependency.prerequisiteSkillId.toString()
            );
        }
    }

    return false;
};
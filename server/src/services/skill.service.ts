import Skill, {type ISkill} from "../models/Skill.js";

export const createSkill = async (
    data: Pick<ISkill , "name" | "slug" | "description" | "domain" | "icon">
): Promise<ISkill> => {
    const skill = await Skill.create(data);

    return skill;
}

export const getSkills = async (): Promise<ISkill[]> => {
    const skills = await Skill.find({ isActive: true })
    .sort({name: 1});

    return skills;
}

export const getSkillById = async (id: string): Promise<ISkill | null> => {
    const skill = await Skill.findById(id);

    return skill;
}

export const updateSkill = async (id: string, data: Partial<Pick<ISkill, "name" | "slug" | "description" | "domain" | "icon">>): Promise<ISkill | null> => {
    const skill = await Skill.findByIdAndUpdate(id, data, {returnDocument: "after", runValidators: true});
    return skill;
}

export const deleteSkill = async (id: string): Promise<ISkill | null> => {
    const skill = await Skill.findByIdAndUpdate(id, {isActive: false}, {returnDocument: "after", runValidators: true});
    return skill;
}
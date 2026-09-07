import Topic, {type ITopic} from "../models/Topic.js";
import Skill, { ISkill } from "../models/Skill.js";
import { AppError } from "../utils/AppError.js";


export const createTopic = async (
    data: Pick<ITopic, "skillId" | "name" | "slug" | "description" | "order">
): Promise<ITopic> => {
    const skillExists = await Skill.exists({
        _id: data.skillId,
        isActive: true,
    });
    
    if(!skillExists) {
        throw new AppError("Skill not found", 404);
    }
    
    const topic = await Topic.create(data);

    return topic;
}

export const getTopics = async (): Promise<ITopic[]> => {
    return Topic.find({ isActive: true}).sort({ skillId: 1, order: 1});
}

export const getTopicById = async (id: string): Promise<ITopic | null> => {
    return Topic.findOne({_id: id, isActive: true});
}

export const getTopicsBySkill = async (skillId: string): Promise<ITopic[]> => {
    return Topic.find({skillId, isActive: true}).sort({ order: 1 });
}

export const updateTopic = async (
    id: string,
    data: Partial<Pick<ITopic, "name" | "slug" | "description" | "order">>
): Promise<ITopic | null> => {
    return Topic.findByIdAndUpdate(id, data, {returnDocument: "after", runValidators: true});
}

export const deleteTopic = async (id: string): Promise<ITopic | null> => {
    return Topic.findByIdAndUpdate(id, {isActive: false}, {returnDocument: "after"});
}
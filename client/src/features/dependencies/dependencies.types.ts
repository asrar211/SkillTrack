import type { Skill } from "@/features/skills/skills.types";

export interface SkillDependency {
  _id: string;
  prerequisiteSkillId?: Skill;
  skillId?: Skill;
  dependentSkillId?: Skill;
}

export interface SkillDependenciesResponse {
  success: boolean;
  data: SkillDependency[];
}

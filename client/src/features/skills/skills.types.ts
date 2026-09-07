export interface Skill {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  domain?: string;
  icon?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SkillsResponse {
  success: boolean;
  data: Skill[];
}

export interface SkillResponse {
  success: boolean;
  data: Skill;
}
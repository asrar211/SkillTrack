
export type LearningActivityType =
  | "learning"
  | "skill-completed"
  | "dsa-solved"
  | "goal-completed";

export interface LearningActivity {
  _id: string;
  userId: string;
  type: LearningActivityType;
  skillId?: string;
  topicId?: string;
  problemId?: string;
  roadmapItemId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface LearningActivityResponse {
  success: boolean;
  data: LearningActivity[];
}

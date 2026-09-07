export type LearningProgressStatus =
  | "not-started"
  | "in-progress"
  | "completed";

export interface LearningProgress {
  _id: string;
  userId: string;
  skillId: string | { _id: string; name: string; slug: string; domain?: string };
  topicId?: string | { _id: string; name: string; slug: string };
  progress: number;
  status: LearningProgressStatus;
  startedAt?: string;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LearningProgressListResponse {
  success: boolean;
  data: LearningProgress[];
}

export interface ProgressSummary {
  overallProgress: number;
  totalItems: number;
  completedItems: number;
  inProgressItems: number;
  notStartedItems: number;
}

export interface ProgressSummaryResponse {
  success: boolean;
  data: ProgressSummary;
}

export interface UpdateLearningProgressPayload {
  skillId: string;
  progress: number;
  topicId?: string;
}

export interface LearningProgressResponse {
  success: boolean;
  message?: string;
  data: LearningProgress;
}

export interface SkillProgressResponse {
  success: boolean;
  data: LearningProgress[];
}

export interface TopicProgress {
  _id: string;
  userId: string;
  skillId: string;
  topicId: {
    _id: string;
    name: string;
    slug: string;
  };
  progress: number;
  status: LearningProgressStatus;
  startedAt?: string;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TopicProgressResponse {
  success: boolean;
  data: TopicProgress[];
}

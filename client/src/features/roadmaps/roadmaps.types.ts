export type RoadmapPriority = "low" | "medium" | "high";

export interface Roadmap {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  items: RoadmapItem[];
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapItem {
  _id: string;
  skillId: string;
  topicId?: string;
  order: number;
  priority: RoadmapPriority;
  estimatedMinutes: number;
  targetDate?: string;
  notes?: string;
}

export interface RoadmapsResponse {
  success: boolean;
  data: Roadmap[];
}

export interface RoadmapResponse {
  success: boolean;
  data: Roadmap;
}

export interface RoadmapProgressItem {
  itemId: string;
  order: number;

  skill: {
    _id: string;
    name: string;
    slug: string;
    description?: string;
  };

  topic: {
    _id: string;
    name: string;
    slug: string;
  } | null;

  priority: "low" | "medium" | "high";

  estimatedMinutes: number;

  targetDate: string | null;

  notes: string;

  progress: number;

  status:
    | "not-started"
    | "in-progress"
    | "completed";
}

export interface RoadmapProgress {
  roadmap: {
    id: string;
    name: string;
    description?: string;
  };

  overallProgress: number;

  totalItems: number;
  completedItems: number;
  inProgressItems: number;

  items: RoadmapProgressItem[];
}

export interface RoadmapProgressResponse {
  success: boolean;
  data: RoadmapProgress;
}

export interface CreateRoadmapItemPayload {
  skillId: string;
  topicId?: string;
  order: number;
  priority?: RoadmapPriority;
  estimatedMinutes?: number;
  targetDate?: string;
  notes?: string;
}

export interface CreateRoadmapPayload {
  name: string;
  description?: string;
  items: CreateRoadmapItemPayload[];
}

export interface RoadmapsResponse {
  success: boolean;
  data: Roadmap[];
}

export interface DashboardOverview {
    overallProgress: number;
    completedSkills: number;
    solvedDSA: number;
    roadmapCount: number;
}

export interface DailyGoal {
    _id: string;
    userId: string;
    date: string;
    targetMinutes: number;
    completedMinutes: number;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Streak {
    currentStreak: number;
    longestStreak: number;
    totalCompletedDays: number;
}

export interface RecommendationSkill {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  domain?: string;
  icon?: string;
}

export interface LearningRecommendation {
  skill: RecommendationSkill;
  roadmapItemId: string;
  progress: number;
  status: "not-started" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  estimatedMinutes: number;
  targetDate: string | null;
  score: number;
  reason: string;
}

export interface DashboardData {
    overview: DashboardOverview;

    dailyGoal: DailyGoal | null;

    streak: Streak;

    recommendations: LearningRecommendation[];

    roadmaps: unknown[];
}

export interface DashboardResponse {
    success: boolean;
    data: DashboardData;
}
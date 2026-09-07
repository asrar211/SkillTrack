// src/features/goals/goals.types.ts

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

export interface CreateDailyGoalPayload {
  targetMinutes: number;
}

export interface UpdateDailyGoalProgressPayload {
  completedMinutes: number;
}

export interface DailyGoalResponse {
  success: boolean;
  message?: string;
  data: DailyGoal | null;
}

export interface Streak {
  currentStreak: number;
  longestStreak: number;
  totalCompletedDays: number;
}

export interface StreakResponse {
  success: boolean;
  data: Streak;
}
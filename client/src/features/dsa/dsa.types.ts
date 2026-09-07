export type DSAPlatform =
  | "leetcode"
  | "codeforces"
  | "codechef"
  | "geeksforgeeks"
  | "hackerrank"
  | "atcoder"
  | "other";

export type DSADifficulty =
  | "easy"
  | "medium"
  | "hard";

export type DSAProgressStatus =
  | "not-started"
  | "attempted"
  | "solved";

export interface DSATopic {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface DSAProblem {
  _id: string;
  title: string;
  slug: string;
  platform: DSAPlatform;
  difficulty: DSADifficulty;
  problemUrl: string;
  topics: DSATopic[];
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DSAProgress {
  _id: string;
  userId: string;
  problemId:
    | string
    | DSAProblem;
  status: DSAProgressStatus;
  attempts: number;
  notes?: string;
  solvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DSAProblemsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface DSAProblemsResponse {
  success: boolean;
  data: DSAProblem[];
  pagination: DSAProblemsPagination;
}

export interface DSAProblemResponse {
  success: boolean;
  data: DSAProblem;
}

export interface CreateDSAProblemPayload {
  title: string;
  slug: string;
  platform: DSAPlatform;
  difficulty: DSADifficulty;
  problemUrl: string;
  topics: string[];
  description?: string;
}

export interface DSATopicsResponse {
  success: boolean;
  data: DSATopic[];
}

export interface DSAProgressResponse {
  success: boolean;
  data: DSAProgress;
}

export interface DSAProgressListResponse {
  success: boolean;
  data: DSAProgress[];
}

export interface UpdateDSAProgressPayload {
  problemId: string;
  status: DSAProgressStatus;
  attempts?: number;
  notes?: string;
}

export interface DSASummaryDifficulty {
  total: number;
  solved: number;
}

export interface DSASummary {
  total: number;
  solved: number;
  attempted: number;
  notStarted: number;

  easy: DSASummaryDifficulty;
  medium: DSASummaryDifficulty;
  hard: DSASummaryDifficulty;
}

export interface DSASummaryResponse {
  success: boolean;
  data: DSASummary;
}

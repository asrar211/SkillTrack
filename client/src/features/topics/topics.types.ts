export interface Topic {
  _id: string;
  skillId: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TopicsResponse {
  success: boolean;
  data: Topic[];
}
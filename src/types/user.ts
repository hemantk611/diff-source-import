export interface UserProfile {
  id: string;
  name: string;
  age: number;
  income: number;
  goals: string;
  riskTolerance: 'low' | 'medium' | 'high';
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface CreateUserRequest {
  name: string;
  age: number;
  income: number;
  goals: string;
  riskTolerance: 'low' | 'medium' | 'high';
  language: string;
}
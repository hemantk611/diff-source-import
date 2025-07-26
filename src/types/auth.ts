export interface LoginRequest {
  emailOrMobile: string;
  password: string;
}

export interface RegistrationRequest {
  name: string;
  age: number;
  income: number;
  goals: string;
  riskTolerance: 'low' | 'medium' | 'high';
  language: string;
  emailOrMobile: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: {
      id: string;
      name: string;
      email?: string;
      mobile?: string;
      language: string;
    };
    token?: string;
  };
  message?: string;
  error?: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  mobile?: string;
  language: string;
}

export interface GoalPlan {
  user_goal: string;
  action_plan_name: string;
  plan_duration: string;
  status: string;
}
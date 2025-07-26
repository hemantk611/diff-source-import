import { GoalPlan } from '@/types/auth';

// Mock data - this will be easily replaceable with actual API calls
const mockGoalPlans: GoalPlan[] = [
  {
    user_goal: 'Retirement Planning',
    action_plan_name: '401k Optimization',
    plan_duration: '30 years',
    status: 'Active'
  },
  {
    user_goal: 'Emergency Fund',
    action_plan_name: 'High-Yield Savings Account',
    plan_duration: '6 months',
    status: 'In Progress'
  },
  {
    user_goal: 'Investment Growth',
    action_plan_name: 'Diversified Portfolio',
    plan_duration: '10 years',
    status: 'Planning'
  },
  {
    user_goal: 'Home Purchase',
    action_plan_name: 'Down Payment Savings',
    plan_duration: '3 years',
    status: 'Active'
  },
  {
    user_goal: 'Child Education',
    action_plan_name: '529 Education Plan',
    plan_duration: '15 years',
    status: 'Active'
  },
  {
    user_goal: 'Debt Reduction',
    action_plan_name: 'Credit Card Payoff',
    plan_duration: '2 years',
    status: 'In Progress'
  },
  {
    user_goal: 'Travel Fund',
    action_plan_name: 'Vacation Savings',
    plan_duration: '1 year',
    status: 'Planning'
  },
  {
    user_goal: 'Business Investment',
    action_plan_name: 'Startup Capital',
    plan_duration: '5 years',
    status: 'Active'
  }
];

export const goalService = {
  // Function to get all goal plans - easily replaceable with API call
  async getGoalPlans(userId?: string): Promise<GoalPlan[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/users/${userId}/goal-plans`);
    // const data = await response.json();
    // return data;
    
    return mockGoalPlans;
  },

  // Function to create a new goal plan
  async createGoalPlan(goalPlan: Omit<GoalPlan, 'id'>): Promise<GoalPlan> {
    // TODO: Replace with actual API call
    // const response = await fetch('/api/goal-plans', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(goalPlan)
    // });
    // return response.json();
    
    const newGoalPlan = { ...goalPlan };
    mockGoalPlans.push(newGoalPlan);
    return newGoalPlan;
  },

  // Function to update a goal plan
  async updateGoalPlan(id: string, updates: Partial<GoalPlan>): Promise<GoalPlan> {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/goal-plans/${id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(updates)
    // });
    // return response.json();
    
    const index = mockGoalPlans.findIndex(plan => plan.user_goal === id);
    if (index !== -1) {
      mockGoalPlans[index] = { ...mockGoalPlans[index], ...updates };
      return mockGoalPlans[index];
    }
    throw new Error('Goal plan not found');
  },

  // Function to delete a goal plan
  async deleteGoalPlan(id: string): Promise<void> {
    // TODO: Replace with actual API call
    // await fetch(`/api/goal-plans/${id}`, { method: 'DELETE' });
    
    const index = mockGoalPlans.findIndex(plan => plan.user_goal === id);
    if (index !== -1) {
      mockGoalPlans.splice(index, 1);
    }
  }
};
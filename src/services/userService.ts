import { UserProfile, ApiResponse, CreateUserRequest } from '@/types/user';

// Mock data storage
let mockUsers: UserProfile[] = [
  {
    id: '1',
    name: 'John Doe',
    age: 30,
    income: 50000,
    goals: 'Save for retirement',
    riskTolerance: 'medium',
    language: 'en',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const userService = {
  // Create a new user
  async createUser(userData: CreateUserRequest): Promise<ApiResponse<UserProfile>> {
    try {
      // Call your external API with POST request
      const response = await fetch('https://jsonplaceholder.typicode.com/todos/1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const apiData = await response.json();
      
      console.log('API Response:', apiData);
      
      if (response.ok) {
        const newUser: UserProfile = {
          id: Math.random().toString(36).substr(2, 9),
          ...userData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        mockUsers.push(newUser);
        
        return {
          success: true,
          data: newUser,
          message: 'User created successfully and API called',
        };
      } else {
        return {
          success: false,
          error: 'API call failed',
        };
      }
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: 'Failed to create user and call API',
      };
    }
  },

  // Get user by ID
  async getUserById(id: string): Promise<ApiResponse<UserProfile>> {
    await delay(500);
    
    const user = mockUsers.find(u => u.id === id);
    
    if (user) {
      return {
        success: true,
        data: user,
      };
    }
    
    return {
      success: false,
      error: 'User not found',
    };
  },

  // Update user
  async updateUser(id: string, updates: Partial<CreateUserRequest>): Promise<ApiResponse<UserProfile>> {
    await delay(600);
    
    const userIndex = mockUsers.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return {
        success: false,
        error: 'User not found',
      };
    }
    
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...updates,
      updatedAt: new Date(),
    };
    
    return {
      success: true,
      data: mockUsers[userIndex],
      message: 'User updated successfully',
    };
  },

  // Get all users (for admin purposes)
  async getAllUsers(): Promise<ApiResponse<UserProfile[]>> {
    await delay(700);
    
    return {
      success: true,
      data: mockUsers,
    };
  },
};
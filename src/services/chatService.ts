export interface ChatRequest {
  userProfile: any;
  message: string;
  language: string;
}

export interface ChatResponse {
  success: boolean;
  data?: {
    id: string;
    name: string;
    data: {
      reply: string;
    };
  };
  message?: string;
  error?: string;
}

export const chatService = {
  async sendMessage(chatData: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await fetch('https://api.restful-api.dev/objects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `Chat from ${chatData.userProfile.name}`,
          data: {
            userProfile: chatData.userProfile,
            message: chatData.message,
            language: chatData.language,
            timestamp: new Date().toISOString(),
          }
        }),
      });

      const apiData = await response.json();
      
      console.log('Chat API Response:', apiData);
      
      if (response.ok) {
        return {
          success: true,
          data: apiData,
        };
      } else {
        return {
          success: false,
          error: 'Failed to send chat message',
        };
      }
    } catch (error) {
      console.error('Chat API Error:', error);
      return {
        success: false,
        error: 'Network error occurred',
      };
    }
  },
};
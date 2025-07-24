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
      reply?: string;
      content?: any;
      type?: 'text' | 'audio' | 'document' | 'image' | 'table' | 'list' | 'file' | 'html';
      fileUrl?: string;
      fileName?: string;
      mimeType?: string;
      metadata?: any;
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

  detectResponseType(responseData: any): string {
    if (!responseData?.data) return 'text';
    
    const data = responseData.data;
    
    // Check for explicit type field
    if (data.type) {
      return data.type;
    }
    
    // Auto-detect based on content structure
    if (data.fileUrl || data.fileName) {
      if (data.mimeType?.startsWith('audio/')) return 'audio';
      if (data.mimeType?.startsWith('image/')) return 'image';
      return 'document';
    }
    
    if (data.content) {
      // Check if content contains HTML tags
      if (typeof data.content === 'string' && /<[^>]*>/g.test(data.content)) {
        return 'html';
      }
      
      if (Array.isArray(data.content)) {
        // Check if it's table data (array of objects with consistent keys)
        if (data.content.length > 0 && typeof data.content[0] === 'object' && !Array.isArray(data.content[0])) {
          return 'table';
        }
        // Otherwise it's a list
        return 'list';
      }
      
      if (typeof data.content === 'object') {
        return 'table';
      }
    }
    
    return 'text';
  }
};
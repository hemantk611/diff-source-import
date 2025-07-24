import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Send, Bot, User, Mic, Volume2, VolumeX, Star, Trophy, Download, Play, Pause, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { chatService } from '@/services/chatService';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'audio' | 'document' | 'image' | 'table' | 'list' | 'file' | 'html';
  fileUrl?: string;
  fileName?: string;
  mimeType?: string;
  metadata?: any;
}

interface ChatInterfaceProps {
  userProfile: any;
  language: string;
}

export const ChatInterface = ({ userProfile, language }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Initial welcome message
    const welcomeMessage: Message = {
      id: '1',
      content: getWelcomeMessage(),
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [userProfile, language]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      // Set language based on current language selection
      const languageMap: Record<string, string> = {
        en: 'en-US',
        hi: 'hi-IN',
      };
      recognitionRef.current.lang = languageMap[language] || 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Speech recognition error",
          description: "Could not recognize speech. Please try again.",
          variant: "destructive",
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [language, toast]);

  const getWelcomeMessage = () => {
    const messages = {
      en: `Hello ${userProfile.name}! 👋 I'm your personalized financial guide. I'm here to help you with ${userProfile.financialGoals.map(goal => {
        const goalMap = {
          savings: 'building savings',
          investment: 'investment planning',
          debt: 'debt management',
          retirement: 'retirement planning',
          education: 'education funding',
          business: 'business financing'
        };
        return goalMap[goal];
      }).join(', ')}. How can I assist you today?`,
      hi: `नमस्ते ${userProfile.name}! 👋 मैं आपका व्यक्तिगत वित्तीय सलाहकार हूं। मैं आपकी ${userProfile.financialGoals.map(goal => {
        const goalMap = {
          savings: 'बचत बनाने',
          investment: 'निवेश योजना',
          debt: 'ऋण प्रबंधन',
          retirement: 'सेवानिवृत्ति योजना',
          education: 'शिक्षा वित्तपोषण',
          business: 'व्यापार वित्तपोषण'
        };
        return goalMap[goal];
      }).join(', ')} में मदद करने के लिए यहां हूं। आज मैं आपकी कैसे सहायता कर सकता हूं?`,
    };
    return messages[language] || messages.en;
  };

  const detectResponseType = (responseData: any): 'text' | 'audio' | 'document' | 'image' | 'table' | 'list' | 'file' | 'html' => {
    if (!responseData) return 'text';
    
    // Check explicit type from server
    if (responseData.type) return responseData.type;
    
    // Check for file-related properties
    if (responseData.fileUrl || responseData.fileName) {
      if (responseData.mimeType) {
        if (responseData.mimeType.startsWith('audio/')) return 'audio';
        if (responseData.mimeType.startsWith('image/')) return 'image';
        if (responseData.mimeType.includes('pdf') || responseData.mimeType.includes('document')) return 'document';
      }
      return 'file';
    }
    
    // Check content structure
    const content = responseData.reply || responseData.content;
    if (typeof content === 'object') {
      if (Array.isArray(content)) return 'list';
      if (content.headers || content.rows) return 'table';
    }
    
    // Check text patterns for table-like structure
    if (typeof content === 'string') {
      const lines = content.split('\n').filter(line => line.trim());
      const colonCount = lines.filter(line => line.includes(':')).length;
      if (colonCount >= 3 && lines.length > 3) return 'table';
    }
    
    return 'text';
  };

  const handlePlayAudio = async (messageId: string, audioUrl: string) => {
    try {
      if (isPlaying[messageId]) {
        setIsPlaying(prev => ({ ...prev, [messageId]: false }));
        return;
      }
      
      const audio = new Audio(audioUrl);
      setIsPlaying(prev => ({ ...prev, [messageId]: true }));
      
      audio.onended = () => {
        setIsPlaying(prev => ({ ...prev, [messageId]: false }));
      };
      
      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      toast({
        title: "Audio Error",
        description: "Could not play audio file",
        variant: "destructive",
      });
      setIsPlaying(prev => ({ ...prev, [messageId]: false }));
    }
  };

  const handleDownloadFile = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // Send message to backend API with user profile and chat data
      const response = await chatService.sendMessage({
        userProfile,
        message: currentInput,
        language,
      });

      if (response.success && response.data) {
        const responseData = response.data.data;
        const content = responseData?.reply || responseData?.content || `API Response: Created object with ID ${response.data.id}. Your message "${currentInput}" was sent successfully with your profile data.`;
        
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: typeof content === 'string' ? content : JSON.stringify(content),
          sender: 'bot',
          timestamp: new Date(),
          type: detectResponseType(responseData),
          fileUrl: responseData?.fileUrl,
          fileName: responseData?.fileName,
          mimeType: responseData?.mimeType,
          metadata: responseData?.metadata,
        };

        setMessages(prev => [...prev, botResponse]);
      } else {
        const errorResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: `Error: ${response.error || 'Failed to send message to backend'}`,
          sender: 'bot',
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, errorResponse]);
      }
    } catch (error) {
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Network error: Could not connect to backend API',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
      
      // Gamification: Add points for interaction
      setPoints(prev => prev + 10);
      if (points > 0 && points % 100 === 0) {
        setLevel(prev => prev + 1);
        toast({
          title: "Level Up! 🎉",
          description: `Congratulations! You've reached level ${level + 1}`,
        });
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleSpeech = () => {
    setIsSpeechEnabled(!isSpeechEnabled);
    toast({
      title: isSpeechEnabled ? "Speech disabled" : "Speech enabled",
      description: isSpeechEnabled ? "Text-to-speech turned off" : "Text-to-speech turned on",
    });
  };

  const renderMessageContent = (message: Message) => {
    switch (message.type) {
      case 'table':
        return renderTableContent(message);
      
      case 'list':
        return renderListContent(message);
      
      case 'audio':
        return (
          <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePlayAudio(message.id, message.fileUrl!)}
              className="h-8 w-8 p-0"
            >
              {isPlaying[message.id] ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <div className="flex-1">
              <p className="text-sm font-medium">{message.fileName || 'Audio Message'}</p>
              <p className="text-xs text-muted-foreground">Click to play</p>
            </div>
          </div>
        );
      
      case 'image':
        return (
          <div className="space-y-2">
            {message.content && <p className="text-sm">{message.content}</p>}
            <div className="relative">
              <img 
                src={message.fileUrl} 
                alt={message.fileName || 'Image'} 
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          </div>
        );
      
      case 'document':
      case 'file':
        return (
          <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
            <div className="h-8 w-8 bg-primary/10 rounded flex items-center justify-center">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{message.fileName || 'Download File'}</p>
              <p className="text-xs text-muted-foreground">{message.mimeType}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownloadFile(message.fileUrl!, message.fileName!)}
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        );
      
      case 'html':
        return (
          <div 
            className="text-sm prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: message.content }}
          />
        );
      
      default:
        return <p className="text-sm whitespace-pre-wrap">{message.content}</p>;
    }
  };

  const renderTableContent = (message: Message) => {
    try {
      const content = typeof message.content === 'string' ? message.content : JSON.stringify(message.content);
      const lines = content.split('\n').filter(line => line.trim());
      
      if (lines.length > 1) {
        return (
          <Table className="w-full text-sm">
            <TableHeader>
              <TableRow>
                <TableHead>Field</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lines.map((line, index) => {
                const parts = line.split(':');
                if (parts.length > 1) {
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{parts[0].trim()}</TableCell>
                      <TableCell>{parts.slice(1).join(':').trim()}</TableCell>
                    </TableRow>
                  );
                } else {
                  return (
                    <TableRow key={index}>
                      <TableCell colSpan={2}>{line}</TableCell>
                    </TableRow>
                  );
                }
              })}
            </TableBody>
          </Table>
        );
      }
    } catch (error) {
      console.error('Error rendering table:', error);
    }
    
    return <p className="text-sm">{message.content}</p>;
  };

  const renderListContent = (message: Message) => {
    try {
      let items: any[] = [];
      
      if (typeof message.content === 'string') {
        items = message.content.split('\n').filter(line => line.trim());
      } else if (Array.isArray(message.content)) {
        items = message.content;
      } else {
        return <p className="text-sm">{JSON.stringify(message.content)}</p>;
      }
      
      return (
        <ul className="space-y-1 text-sm">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>{typeof item === 'string' ? item : JSON.stringify(item)}</span>
            </li>
          ))}
        </ul>
      );
    } catch (error) {
      console.error('Error rendering list:', error);
      return <p className="text-sm">{message.content}</p>;
    }
  };

  const startVoiceRecognition = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Speech recognition not supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with gamification */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Financial AI Assistant</h3>
              <p className="text-sm text-muted-foreground">Personalized for {userProfile.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">{points} pts</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium">Level {level}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSpeech}
              className="h-8 w-8 p-0"
              aria-label={isSpeechEnabled ? "Disable speech" : "Enable speech"}
            >
              {isSpeechEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender === 'bot' && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
              
              <Card className={`max-w-md ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : ''}`}>
                <CardContent className="p-3">
                  {renderMessageContent(message)}
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    {message.type && message.type !== 'text' && (
                      <Badge variant="secondary" className="text-xs">
                        {message.type}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {message.sender === 'user' && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
                  <User className="h-4 w-4 text-accent-foreground" />
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <Card>
                <CardContent className="p-3">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-current rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="border-t bg-card p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={language === 'hi' ? 'अपना सवाल पूछें...' : 'Ask your financial question...'}
                className="resize-none"
                disabled={isTyping}
              />
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={startVoiceRecognition}
              className={isListening ? 'bg-destructive text-destructive-foreground' : ''}
              disabled={isTyping}
            >
              <Mic className="h-4 w-4" />
            </Button>
            
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputValue.trim() || isTyping}
              className="px-6"
            >
              <Send className="h-4 w-4 mr-2" />
              {language === 'hi' ? 'भेजें' : 'Send'}
            </Button>
          </div>
          
          {isListening && (
            <div className="mt-2 text-center">
              <Badge variant="destructive" className="animate-pulse">
                🎤 {language === 'hi' ? 'सुन रहा है...' : 'Listening...'}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
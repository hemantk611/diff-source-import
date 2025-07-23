import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Mic, Volume2, VolumeX, Star, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { chatService } from '@/services/chatService';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'goal' | 'achievement';
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

  const generateBotResponse = (userMessage: string): string => {
    const responses = {
      en: {
        savings: "Great question about savings! Based on your profile, I recommend starting with an emergency fund covering 3-6 months of expenses. Would you like specific strategies for your situation?",
        investment: "For investment guidance, considering your experience level, let's start with diversified index funds. They're perfect for building long-term wealth with lower risk.",
        debt: "Debt management is crucial! I suggest the avalanche method - pay minimums on all debts, then focus extra payments on the highest interest rate debt first.",
        budget: "Budgeting is the foundation of financial health! Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings and debt repayment.",
        default: "That's a great question! Based on your profile as a " + userProfile.clientType + ", I'd be happy to provide personalized guidance. Could you be more specific about what you'd like to know?"
      },
      hi: {
        savings: "बचत के बारे में बेहतरीन सवाल! आपकी प्रोफाइल के आधार पर, मैं 3-6 महीने के खर्च को कवर करने वाले इमरजेंसी फंड से शुरुआत करने की सलाह देता हूं। क्या आप अपनी स्थिति के लिए विशिष्ट रणनीतियां चाहते हैं?",
        investment: "निवेश मार्गदर्शन के लिए, आपके अनुभव स्तर को देखते हुए, आइए विविधीकृत इंडेक्स फंड से शुरुआत करते हैं। ये कम जोखिम के साथ दीर्घकालिक संपत्ति निर्माण के लिए बेहतरीन हैं।",
        debt: "ऋण प्रबंधन महत्वपूर्ण है! मैं एवलांच मेथड का सुझाव देता हूं - सभी ऋणों पर न्यूनतम भुगतान करें, फिर सबसे अधिक ब्याज दर वाले ऋण पर अतिरिक्त भुगतान पर ध्यान दें।",
        budget: "बजटिंग वित्तीय स्वास्थ्य की नींव है! 50/30/20 नियम आजमाएं: 50% जरूरतें, 30% इच्छाएं, 20% बचत और ऋण चुकौती।",
        default: "यह एक बेहतरीन सवाल है! " + userProfile.clientType + " के रूप में आपकी प्रोफाइल के आधार पर, मैं व्यक्तिगत मार्गदर्शन प्रदान करने में खुश हूं। क्या आप और विशिष्ट हो सकते हैं कि आप क्या जानना चाहते हैं?"
      }
    };

    const langResponses = responses[language] || responses.en;
    
    // Hindi keyword detection
    const hindiKeywords = {
      savings: ['बचत', 'सेव', 'पैसे बचाना'],
      investment: ['निवेश', 'इन्वेस्टमेंट', 'शेयर'],
      debt: ['कर्ज', 'ऋण', 'लोन'],
      budget: ['बजट', 'खर्च', 'हिसाब']
    };
    
    const messageLower = userMessage.toLowerCase();
    
    if (language === 'hi') {
      if (hindiKeywords.savings.some(keyword => messageLower.includes(keyword)) || messageLower.includes('save')) {
        return langResponses.savings || langResponses.default;
      }
      if (hindiKeywords.investment.some(keyword => messageLower.includes(keyword)) || messageLower.includes('invest')) {
        return langResponses.investment || langResponses.default;
      }
      if (hindiKeywords.debt.some(keyword => messageLower.includes(keyword)) || messageLower.includes('debt')) {
        return langResponses.debt || langResponses.default;
      }
      if (hindiKeywords.budget.some(keyword => messageLower.includes(keyword)) || messageLower.includes('budget')) {
        return langResponses.budget || langResponses.default;
      }
    } else {
      if (messageLower.includes('savings') || messageLower.includes('save')) {
        return langResponses.savings || langResponses.default;
      }
      if (messageLower.includes('invest') || messageLower.includes('investment')) {
        return langResponses.investment || langResponses.default;
      }
      if (messageLower.includes('debt') || messageLower.includes('loan')) {
        return langResponses.debt || langResponses.default;
      }
      if (messageLower.includes('budget') || messageLower.includes('spending')) {
        return langResponses.budget || langResponses.default;
      }
    }
    
    return langResponses.default;
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
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: `API Response: Created object with ID ${response.data.id}. Your message "${currentInput}" was sent successfully with your profile data.`,
          sender: 'bot',
          timestamp: new Date(),
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
              aria-label={isSpeechEnabled ? "Disable speech" : "Enable speech"}
            >
              {isSpeechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  message.sender === 'user' ? 'bg-primary' : 'bg-secondary'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <Bot className="h-4 w-4 text-secondary-foreground" />
                  )}
                </div>
                
                <Card className={`${
                  message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-card'
                }`}>
                  <CardContent className="p-3">
                    <p className="text-sm">{message.content}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[80%]">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <Bot className="h-4 w-4 text-secondary-foreground" />
                </div>
                <Card className="bg-card">
                  <CardContent className="p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input */}
      <div className="border-t bg-card p-4">
        <div className="flex gap-2">
          <Input
            placeholder={language === 'hi' ? 'अपना प्रश्न टाइप करें...' : 'Type your question...'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
            aria-label="Message input"
          />
          <Button 
            variant="outline" 
            size="icon"
            onClick={startVoiceRecognition}
            disabled={isListening}
            className={isListening ? 'bg-red-500 hover:bg-red-600 text-white' : ''}
            aria-label={isListening ? "Stop recording" : "Start voice input"}
          >
            <Mic className={`h-4 w-4 ${isListening ? 'animate-pulse' : ''}`} />
          </Button>
          <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge variant="outline" className="cursor-pointer hover:bg-primary-light" onClick={() => setInputValue(language === 'hi' ? "मैं पैसे कैसे बचाना शुरू कर सकता हूं?" : "How can I start saving money?")}>
            💰 {language === 'hi' ? 'बचत टिप्स' : 'Savings Tips'}
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-primary-light" onClick={() => setInputValue(language === 'hi' ? "आप कौन से निवेश विकल्प सुझाते हैं?" : "What investment options do you recommend?")}>
            📈 {language === 'hi' ? 'निवेश सहायता' : 'Investment Help'}
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-primary-light" onClick={() => setInputValue(language === 'hi' ? "मुझे बजट बनाने में मदद करें" : "Help me create a budget")}>
            📊 {language === 'hi' ? 'बजटिंग' : 'Budgeting'}
          </Badge>
        </div>
      </div>
    </div>
  );
};
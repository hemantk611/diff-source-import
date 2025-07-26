import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { ChatInterface } from './ChatInterface';
import { User } from '@/types/auth';

interface ChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  language: string;
}

export const ChatPopup = ({ isOpen, onClose, user, language }: ChatPopupProps) => {
  // Convert User to UserProfile format for ChatInterface
  const userProfile = {
    id: user.id,
    name: user.name,
    age: 30, // Default values since we don't have them in User type
    income: 50000,
    goals: 'Financial Planning',
    riskTolerance: 'medium' as const,
    language: user.language,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle>FinBuddy Chat Assistant</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <ChatInterface
            userProfile={userProfile}
            selectedLanguage={language}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
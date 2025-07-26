import { LanguageSelector } from './LanguageSelector';
import { User } from '@/types/auth';
import { Button } from './ui/button';
import { LogOut, User as UserIcon } from 'lucide-react';
import { authService } from '@/services/authService';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  user?: User | null;
  showUserInfo?: boolean;
}

export const Header = ({ selectedLanguage, onLanguageChange, user, showUserInfo = false }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return (
    <header className="w-full bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and App Name */}
          <div className="flex items-center gap-3">
            <img 
              src="/src/assets/aifinancecoach-logo.png" 
              alt="FinBuddy Logo" 
              className="h-8 w-8"
            />
            <h1 className="text-xl font-bold text-primary">FinBuddy</h1>
          </div>

          {/* Right side - User info and Language selector */}
          <div className="flex items-center gap-4">
            {showUserInfo && user && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <UserIcon className="h-4 w-4" />
                  <span className="font-medium">{user.name}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="h-8"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            )}
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={onLanguageChange}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
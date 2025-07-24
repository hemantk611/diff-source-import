import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChatInterface } from "@/components/ChatInterface";
import { LanguageSelector } from "@/components/LanguageSelector";
import finbuddyLogo from "@/assets/aifinancecoach-logo.png";

const Chatbot = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi'>('en');

  useEffect(() => {
    // Get user profile and language from navigation state
    if (location.state?.userProfile) {
      setUserProfile(location.state.userProfile);
      setSelectedLanguage(location.state.selectedLanguage || 'en');
    } else {
      // If no user profile, redirect to welcome page
      navigate('/welcome');
    }
  }, [location.state, navigate]);

  if (!userProfile) {
    return null; // Will redirect to welcome page
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <img 
              src={finbuddyLogo} 
              alt="FinBuddy Logo" 
              className="w-12 h-12 rounded-lg shadow-md"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">FinBuddy</h1>
              <p className="text-sm text-gray-600">
                Welcome back, {userProfile.name}!
              </p>
            </div>
          </div>
          <LanguageSelector 
            selectedLanguage={selectedLanguage}
            onLanguageChange={(lang) => setSelectedLanguage(lang as 'en' | 'hi')}
          />
        </div>

        {/* Chat Interface */}
        <ChatInterface 
          userProfile={userProfile}
          language={selectedLanguage}
        />
      </div>
    </div>
  );
};

export default Chatbot;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "@/components/UserProfile";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Globe, Star, Trophy } from "lucide-react";
import finbuddyLogo from "@/assets/aifinancecoach-logo.png";

const Welcome = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi'>('en');
  const navigate = useNavigate();

  const getTranslation = (key: string) => {
    const translations = {
      en: {
        tagline: "Your trusted AI financial coach",
        hero_title: "Your Personalized Financial Journey Starts Here",
        hero_description: "Join thousands of users who've transformed their financial future with FinBuddy's personalized coaching.",
        feature_inclusive: "Inclusive",
        feature_inclusive_desc: "Designed for all backgrounds and financial literacy levels",
        feature_multilingual: "Multilingual",
        feature_multilingual_desc: "Available in multiple languages for better accessibility",
        feature_secure: "Secure",
        feature_secure_desc: "Your financial data is protected with bank-level security",
        feature_gamified: "Gamified",
        feature_gamified_desc: "Learn through interactive challenges and achievements"
      },
      hi: {
        tagline: "आपका विश्वसनीय AI वित्तीय कोच",
        hero_title: "वित्तीय ज्ञान के साथ विविध समुदायों को सशक्त बनाना",
        hero_description: "हजारों उपयोगकर्ताओं के साथ जुड़ें जिन्होंने FinBuddy के व्यक्तिगत कोचिंग से अपना वित्तीय भविष्य बदला है।",
        feature_inclusive: "समावेशी",
        feature_inclusive_desc: "सभी पृष्ठभूमि और वित्तीय साक्षरता स्तरों के लिए डिज़ाइन किया गया",
        feature_multilingual: "बहुभाषी",
        feature_multilingual_desc: "बेहतर पहुंच के लिए कई भाषाओं में उपलब्ध",
        feature_secure: "सुरक्षित",
        feature_secure_desc: "आपका वित्तीय डेटा बैंक-स्तरीय सुरक्षा से सुरक्षित है",
        feature_gamified: "गेमिफाइड",
        feature_gamified_desc: "इंटरैक्टिव चुनौतियों और उपलब्धियों के माध्यम से सीखें"
      }
    };
    return translations[selectedLanguage][key] || key;
  };

  const handleProfileComplete = (userProfile: any) => {
    // Navigate to chatbot with user profile data
    navigate('/chatbot', { 
      state: { 
        userProfile, 
        selectedLanguage 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <img 
              src={finbuddyLogo} 
              alt="FinBuddy Logo" 
              className="w-12 h-12 rounded-lg shadow-md"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">FinBuddy</h1>
              <p className="text-sm text-gray-600">{getTranslation('tagline')}</p>
            </div>
          </div>
          <LanguageSelector 
            selectedLanguage={selectedLanguage}
            onLanguageChange={(lang) => setSelectedLanguage(lang as 'en' | 'hi')}
          />
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {getTranslation('hero_title')}
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            {getTranslation('hero_description')}
          </p>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0 text-center">
                <Shield className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-lg font-semibold mb-2">{getTranslation('feature_inclusive')}</h3>
                <p className="text-gray-600 text-sm">{getTranslation('feature_inclusive_desc')}</p>
              </CardContent>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0 text-center">
                <Globe className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-lg font-semibold mb-2">{getTranslation('feature_multilingual')}</h3>
                <p className="text-gray-600 text-sm">{getTranslation('feature_multilingual_desc')}</p>
              </CardContent>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0 text-center">
                <Star className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                <h3 className="text-lg font-semibold mb-2">{getTranslation('feature_secure')}</h3>
                <p className="text-gray-600 text-sm">{getTranslation('feature_secure_desc')}</p>
              </CardContent>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0 text-center">
                <Trophy className="w-12 h-12 mx-auto mb-4 text-orange-600" />
                <h3 className="text-lg font-semibold mb-2">{getTranslation('feature_gamified')}</h3>
                <p className="text-gray-600 text-sm">{getTranslation('feature_gamified_desc')}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* User Profile Form */}
        <UserProfile 
          onProfileComplete={handleProfileComplete}
          language={selectedLanguage}
        />
      </div>
    </div>
  );
};

export default Welcome;
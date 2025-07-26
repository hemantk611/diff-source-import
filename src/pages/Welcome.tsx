import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/components/LoginForm';
import { RegistrationForm } from '@/components/RegistrationForm';
import { PolicyConsentDialog } from '@/components/PolicyConsentDialog';
import { UserProfile } from '@/components/UserProfile';
import { Shield, Globe, Gamepad2, Users, LogIn, UserPlus, Star, Trophy } from 'lucide-react';

const Welcome = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [pendingUserData, setPendingUserData] = useState<any>(null);
  const navigate = useNavigate();

  const getTranslation = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        welcome: 'Welcome to FinBuddy',
        tagline: 'Your Trusted AI Financial Coach',
        heroTitle: 'Empowering Diverse Communities with Personalized Financial Guidance',
        heroDescription: 'Join thousands who trust FinBuddy for inclusive, multilingual financial coaching tailored to your unique needs and cultural context.',
        inclusiveDesign: 'Inclusive Design',
        inclusiveDescription: 'Built for everyone, regardless of background or financial literacy level',
        multilingual: 'Multilingual Support',
        multilingualDescription: 'Native language support for better understanding and comfort',
        secure: 'Secure & Private',
        secureDescription: 'Your financial data is protected with enterprise-grade security',
        gamified: 'Gamified Learning',
        gamifiedDescription: 'Interactive lessons make financial education engaging and memorable',
        getStarted: 'Get Started with Your Financial Journey',
        login: 'Login',
        register: 'Register',
      },
      hi: {
        welcome: 'FinBuddy में आपका स्वागत है',
        tagline: 'आपका विश्वसनीय AI वित्तीय कोच',
        heroTitle: 'व्यक्तिगत वित्तीय मार्गदर्शन के साथ विविध समुदायों को सशक्त बनाना',
        heroDescription: 'हजारों लोगों के साथ जुड़ें जो आपकी अनूठी आवश्यकताओं और सांस्कृतिक संदर्भ के अनुकूल समावेशी, बहुभाषी वित्तीय कोचिंग के लिए FinBuddy पर भरोसा करते हैं।',
        inclusiveDesign: 'समावेशी डिज़ाइन',
        inclusiveDescription: 'पृष्ठभूमि या वित्तीय साक्षरता स्तर की परवाह किए बिना सभी के लिए बनाया गया',
        multilingual: 'बहुभाषी समर्थन',
        multilingualDescription: 'बेहतर समझ और आराम के लिए मातृभाषा का समर्थन',
        secure: 'सुरक्षित और निजी',
        secureDescription: 'आपका वित्तीय डेटा एंटरप्राइज़-ग्रेड सुरक्षा के साथ सुरक्षित है',
        gamified: 'गेमिफाइड लर्निंग',
        gamifiedDescription: 'इंटरैक्टिव पाठ वित्तीय शिक्षा को आकर्षक और यादगार बनाते हैं',
        getStarted: 'अपनी वित्तीय यात्रा शुरू करें',
        login: 'लॉगिन',
        register: 'पंजीकरण',
      },
    };
    
    return translations[selectedLanguage]?.[key] || translations.en[key];
  };

  const handleLoginSuccess = (user: any) => {
    setShowLogin(false);
    navigate('/dashboard');
  };

  const handleRegistrationSuccess = (userData: any) => {
    setShowRegister(false);
    setPendingUserData(userData);
    setShowConsent(true);
  };

  const handleConsentAccept = () => {
    setShowConsent(false);
    navigate('/dashboard');
  };

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
        />
        <div className="flex items-center justify-center p-8">
          <LoginForm
            onSuccess={handleLoginSuccess}
            onCancel={() => setShowLogin(false)}
            language={selectedLanguage}
          />
        </div>
      </div>
    );
  }

  if (showRegister) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
        />
        <div className="flex items-center justify-center p-8">
          <RegistrationForm
            onSuccess={handleRegistrationSuccess}
            onCancel={() => setShowRegister(false)}
            language={selectedLanguage}
          />
        </div>
        {showConsent && (
          <PolicyConsentDialog
            open={showConsent}
            onOpenChange={setShowConsent}
            onAccept={handleConsentAccept}
            userProfile={pendingUserData}
            language={selectedLanguage}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            {getTranslation('heroTitle')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {getTranslation('heroDescription')}
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              onClick={() => setShowLogin(true)}
              className="px-8 py-3 text-lg"
            >
              <LogIn className="mr-2 h-5 w-5" />
              {getTranslation('login')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setShowRegister(true)}
              className="px-8 py-3 text-lg"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              {getTranslation('register')}
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>{getTranslation('inclusiveDesign')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{getTranslation('inclusiveDescription')}</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>{getTranslation('multilingual')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{getTranslation('multilingualDescription')}</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>{getTranslation('secure')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{getTranslation('secureDescription')}</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Gamepad2 className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>{getTranslation('gamified')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{getTranslation('gamifiedDescription')}</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* User Profile Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {getTranslation('getStarted')}
            </h2>
          </div>
          <UserProfile
            onProfileComplete={() => {}}
            language={selectedLanguage}
          />
        </div>
      </main>
    </div>
  );
};

export default Welcome;
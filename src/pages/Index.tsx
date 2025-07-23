
import { useState } from 'react';
import { UserProfile } from '@/components/UserProfile';
import { ChatInterface } from '@/components/ChatInterface';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Globe, Users, Award } from 'lucide-react';
import finBuddyLogo from '@/assets/aifinancecoach-logo.png';

const Index = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleProfileComplete = (profile: any) => {
    setUserProfile(profile);
  };

  // Translation function
  const getTranslation = (key: string) => {
    const translations = {
      en: {
        tagline: "Trusted Financial Guidance",
        heroTitle: "Your Personalized Financial Journey Starts Here",
        heroDescription: "Empowering diverse communities with AI-driven financial guidance, accessible support, and multilingual expertise for everyone's financial success.",
        inclusiveTitle: "Inclusive Design",
        inclusiveDesc: "Supporting farmers, Gen Z, elderly, minorities, and people with disabilities",
        multilingualTitle: "Multilingual",
        multilingualDesc: "Available in 6+ languages with regional financial insights",
        secureTitle: "Secure & Private",
        secureDesc: "Bank-level security with complete data privacy protection",
        gamifiedTitle: "Gamified Learning",
        gamifiedDesc: "Earn points and level up while achieving your financial goals"
      },
      hi: {
        tagline: "भरोसेमंद वित्तीय मार्गदर्शन",
        heroTitle: "आपकी व्यक्तिगत वित्तीय यात्रा यहाँ से शुरू होती है",
        heroDescription: "विविध समुदायों को AI-संचालित वित्तीय मार्गदर्शन, सुलभ सहायता, और हर व्यक्ति की वित्तीय सफलता के लिए बहुभाषी विशेषज्ञता के साथ सशक्त बनाना।",
        inclusiveTitle: "समावेशी डिज़ाइन",
        inclusiveDesc: "किसानों, जेन Z, बुजुर्गों, अल्पसंख्यकों और विकलांग लोगों का समर्थन करना",
        multilingualTitle: "बहुभाषी",
        multilingualDesc: "क्षेत्रीय वित्तीय अंतर्दृष्टि के साथ 6+ भाषाओं में उपलब्ध",
        secureTitle: "सुरक्षित और निजी",
        secureDesc: "पूर्ण डेटा गोपनीयता सुरक्षा के साथ बैंक-स्तरीय सुरक्षा",
        gamifiedTitle: "गेमिफाइड लर्निंग",
        gamifiedDesc: "अपने वित्तीय लक्ष्यों को प्राप्त करते समय अंक अर्जित करें और स्तर बढ़ाएं"
      }
    };
    return translations[selectedLanguage]?.[key] || translations.en[key];
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
        {/* Header */}
        <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg">
                  <img src={finBuddyLogo} alt="FinBuddy Logo" className="h-8 w-8 object-contain" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    FinBuddy
                  </h1>
                  <p className="text-sm text-muted-foreground">{getTranslation('tagline')}</p>
                </div>
              </div>
              
              <LanguageSelector 
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
              />
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              {getTranslation('heroTitle')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              {getTranslation('heroDescription')}
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-4">
                <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{getTranslation('inclusiveTitle')}</h3>
                <p className="text-sm text-muted-foreground">{getTranslation('inclusiveDesc')}</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-4">
                <div className="w-12 h-12 rounded-full bg-secondary-light flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-semibold mb-2">{getTranslation('multilingualTitle')}</h3>
                <p className="text-sm text-muted-foreground">{getTranslation('multilingualDesc')}</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-4">
                <div className="w-12 h-12 rounded-full bg-accent-light flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">{getTranslation('secureTitle')}</h3>
                <p className="text-sm text-muted-foreground">{getTranslation('secureDesc')}</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-4">
                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-success" />
                </div>
                <h3 className="font-semibold mb-2">{getTranslation('gamifiedTitle')}</h3>
                <p className="text-sm text-muted-foreground">{getTranslation('gamifiedDesc')}</p>
              </CardContent>
            </Card>
          </div>

          {/* Profile Setup */}
          <UserProfile onProfileComplete={handleProfileComplete} language={selectedLanguage} />
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md">
                <img src={finBuddyLogo} alt="FinBuddy Logo" className="h-6 w-6 object-contain" />
              </div>
              <h1 className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                FinBuddy
              </h1>
            </div>
            
            <LanguageSelector 
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <div className="flex-1 container mx-auto p-4">
        <div className="h-full max-w-4xl mx-auto">
          <ChatInterface userProfile={userProfile} language={selectedLanguage} />
        </div>
      </div>
    </div>
  );
};

export default Index;

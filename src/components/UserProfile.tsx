import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUserService } from '@/hooks/useUserService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { User, Target, Users, Accessibility } from 'lucide-react';

const clientTypes = [
  { id: 'farmer', name: { en: 'Farmer', hi: 'किसान' }, icon: '🌾', description: { en: 'Plan crop loans, KCC, Schemes', hi: 'फसल ऋण, केसीसी, योजनाएं' } },
  { id: 'student', name: { en: 'Student | GenZ', hi: 'छात्र | जेन Z' }, icon: '🎓', description: { en: 'Plan scholarship, Investment', hi: 'छात्रवृत्ति, निवेश की योजना' } },
  { id: 'professional', name: { en: 'Professionals | Entrepreneurs', hi: 'पेशेवर | उद्यमी' }, icon: '💼', description: { en: 'Manage budgets, Taxes, Investment', hi: 'बजट, कर, निवेश प्रबंधन' } },
  { id: 'senior', name: { en: 'Senior Citizen', hi: 'वरिष्ठ नागरिक' }, icon: '👴', description: { en: 'Manage pension, Secure life saving', hi: 'पेंशन प्रबंधन, जीवन बचत' } },
  { id: 'differently-abled', name: { en: 'Differently Abled', hi: 'दिव्यांग' }, icon: '♿', description: { en: 'Plan Income, Saving for future', hi: 'आय, भविष्य की बचत योजना' } },
  { id: 'minority', name: { en: 'Minority | Worker', hi: 'अल्पसंख्यक/श्रमिक' }, icon: '🤝', description: { en: 'Set Goals and Plan for emergencies', hi: 'लक्ष्य निर्धारण और आपातकाल योजना' } },
];

const accessibilityNeeds = [
  { id: 'visual', name: { en: 'Visual Impairment', hi: 'दृश्य हानि' }, icon: '👁️' },
  { id: 'hearing', name: { en: 'Hearing Impairment', hi: 'श्रवण हानि' }, icon: '👂' },
  { id: 'cognitive', name: { en: 'Cognitive Challenges', hi: 'संज्ञानात्मक चुनौतियां' }, icon: '🧠' },
  { id: 'motor', name: { en: 'Motor Disabilities', hi: 'मोटर विकलांगता' }, icon: '🦽' },
  { id: 'none', name: { en: 'No Special Needs', hi: 'कोई विशेष आवश्यकता नहीं' }, icon: '✅' },
];

const financialGoalsByType = {
  farmer: [
    { id: 'crop-loan', name: { en: 'Get Crop Loan', hi: 'फसल ऋण प्राप्त करें' }, icon: '🌾' },
    { id: 'seasonal-saving', name: { en: 'Saving For Next Season', hi: 'अगले सीजन के लिए बचत' }, icon: '💰' },
    { id: 'farm-insurance', name: { en: 'Family & Crops Insurance', hi: 'परिवार और फसल बीमा' }, icon: '🛡️' },
    { id: 'farm-equipment', name: { en: 'Buy Farm Equipment', hi: 'कृषि उपकरण खरीदें' }, icon: '🚜' },
    { id: 'govt-schemes', name: { en: 'Govt Subsidy & Schemes Help', hi: 'सरकारी सब्सिडी और योजना सहायता' }, icon: '🏛️' },
  ],
  student: [
    { id: 'pocket-money', name: { en: 'Save My Pocket Money', hi: 'जेब खर्च की बचत' }, icon: '💰' },
    { id: 'college-fees', name: { en: 'Plan For College Fees', hi: 'कॉलेज फीस की योजना' }, icon: '🎓' },
    { id: 'credit-score', name: { en: 'Build Credit Score', hi: 'क्रेडिट स्कोर बनाएं' }, icon: '📊' },
    { id: 'start-investing', name: { en: 'Start Investing', hi: 'निवेश शुरू करें' }, icon: '📈' },
    { id: 'scholarship', name: { en: 'Plan Scholarship', hi: 'छात्रवृत्ति योजना' }, icon: '🏆' },
    { id: 'study-loan', name: { en: 'Plan Higher Studies Loan', hi: 'उच्च शिक्षा ऋण योजना' }, icon: '📚' },
  ],
  professional: [
    { id: 'budget', name: { en: 'Make My Budget', hi: 'अपना बजट बनाएं' }, icon: '📋' },
    { id: 'house-wedding', name: { en: 'Save For House | Wedding', hi: 'घर | शादी के लिए बचत' }, icon: '🏠' },
    { id: 'tax-planning', name: { en: 'Tax Planning', hi: 'कर योजना' }, icon: '📄' },
    { id: 'business-loan', name: { en: 'Get Business Loan', hi: 'व्यापार ऋण प्राप्त करें' }, icon: '🏢' },
    { id: 'investing', name: { en: 'Start Investing', hi: 'निवेश शुरू करें' }, icon: '📈' },
    { id: 'insurance-planning', name: { en: 'Insurance Planning', hi: 'बीमा योजना' }, icon: '🛡️' },
  ],
  senior: [
    { id: 'pension', name: { en: 'Secure My Pension', hi: 'पेंशन सुरक्षित करें' }, icon: '🏖️' },
    { id: 'medical-expenses', name: { en: 'Plan Medical Expenses', hi: 'चिकित्सा व्यय योजना' }, icon: '🏥' },
    { id: 'safe-saving', name: { en: 'Safe Saving Plan', hi: 'सुरक्षित बचत योजना' }, icon: '💰' },
    { id: 'family-future', name: { en: 'Support Family Future', hi: 'परिवार के भविष्य का समर्थन' }, icon: '👨‍👩‍👧‍👦' },
    { id: 'avoid-frauds', name: { en: 'Avoid Frauds', hi: 'धोखाधड़ी से बचें' }, icon: '🛡️' },
  ],
  'differently-abled': [
    { id: 'bank-account', name: { en: 'Open Bank Account', hi: 'बैंक खाता खोलें' }, icon: '🏦' },
    { id: 'daily-spending', name: { en: 'Plan Daily Spending', hi: 'दैनिक खर्च की योजना' }, icon: '📱' },
    { id: 'emergency-save', name: { en: 'Save for Emergency', hi: 'आपातकाल के लिए बचत' }, icon: '🚨' },
    { id: 'digital-payments', name: { en: 'Use Digital Payments Safely', hi: 'डिजिटल भुगतान सुरक्षित रूप से उपयोग' }, icon: '💳' },
    { id: 'small-loan', name: { en: 'Get Small Loan Help', hi: 'छोटे ऋण की सहायता' }, icon: '💰' },
  ],
  minority: [
    { id: 'income-support', name: { en: 'Get Income Support', hi: 'आय सहायता प्राप्त करें' }, icon: '💰' },
    { id: 'medical-plan', name: { en: 'Plan Medical Expenses', hi: 'चिकित्सा व्यय योजना' }, icon: '🏥' },
    { id: 'future-save', name: { en: 'Save For Future', hi: 'भविष्य के लिए बचत' }, icon: '💰' },
    { id: 'family-support', name: { en: 'Support My Family', hi: 'अपने परिवार का समर्थन' }, icon: '👨‍👩‍👧‍👦' },
  ],
};

interface UserProfileProps {
  onProfileComplete: (profile: any) => void;
  language: string;
}

export const UserProfile = ({ onProfileComplete, language }: UserProfileProps) => {
  const { createUser, loading } = useUserService();
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    clientType: '',
    accessibilityNeeds: [],
    financialGoals: [],
    region: '',
    experience: ''
  });

  const handleAccessibilityToggle = (needId: string) => {
    setProfile(prev => ({
      ...prev,
      accessibilityNeeds: prev.accessibilityNeeds.includes(needId)
        ? prev.accessibilityNeeds.filter(id => id !== needId)
        : [...prev.accessibilityNeeds, needId]
    }));
  };

  const handleGoalToggle = (goalId: string) => {
    setProfile(prev => ({
      ...prev,
      financialGoals: prev.financialGoals.includes(goalId)
        ? prev.financialGoals.filter(id => id !== goalId)
        : [...prev.financialGoals, goalId]
    }));
  };

  const handleSubmit = async () => {
    if (profile.name && profile.clientType && profile.phone) {
      // Call your API to save user data
      const savedUser = await createUser({
        name: profile.name,
        age: parseInt(profile.age) || 0,
        income: 0, // Default income - you can collect this in your form later
        goals: profile.financialGoals.join(', '),
        riskTolerance: profile.experience === 'beginner' ? 'low' : profile.experience === 'intermediate' ? 'medium' : 'high',
        language: language
      });
      
      if (savedUser) {
        onProfileComplete(profile);
      }
    }
  };

  // Translation function
  const getTranslation = (key: string) => {
    const translations = {
      en: {
        welcomeTitle: "Welcome to Your Financial Guide",
        welcomeDesc: "Let's personalize your experience to provide the best guidance for your needs",
        name: "Name *",
        namePlace: "Enter your name",
        age: "Age",
        agePlace: "Your age",
        region: "Region",
        regionPlace: "Your country/region",
        clientProfile: "Client Profile *",
        accessibilityNeedsTitle: "Accessibility Needs",
        financialGoalsTitle: "Financial Goals",
        experienceLevel: "Financial Experience Level",
        experiencePlaceholder: "Select your experience level",
        beginnerExp: "Beginner - New to financial planning",
        intermediateExp: "Intermediate - Some experience",
        advancedExp: "Advanced - Experienced investor",
        email: "Email",
        emailPlace: "Enter your email",
        phone: "Phone Number *",
        phonePlace: "Enter your phone number",
        startJourney: "Start My Financial Journey"
      },
      hi: {
        welcomeTitle: "अपने वित्तीय गाइड में आपका स्वागत है",
        welcomeDesc: "आइए आपकी आवश्यकताओं के लिए सर्वोत्तम मार्गदर्शन प्रदान करने हेतु आपके अनुभव को व्यक्तिगत बनाते हैं",
        name: "नाम *",
        namePlace: "अपना नाम दर्ज करें",
        age: "आयु",
        agePlace: "आपकी आयु",
        region: "क्षेत्र",
        regionPlace: "आपका देश/क्षेत्र",
        clientProfile: "क्लाइंट प्रोफाइल *",
        accessibilityNeedsTitle: "पहुंच आवश्यकताएं",
        financialGoalsTitle: "वित्तीय लक्ष्य",
        experienceLevel: "वित्तीय अनुभव स्तर",
        experiencePlaceholder: "अपना अनुभव स्तर चुनें",
        beginnerExp: "शुरुआती - वित्तीय योजना में नया",
        intermediateExp: "मध्यम - कुछ अनुभव",
        advancedExp: "उन्नत - अनुभवी निवेशक",
        email: "ईमेल",
        emailPlace: "अपना ईमेल दर्ज करें",
        phone: "फोन नंबर *",
        phonePlace: "अपना फोन नंबर दर्ज करें",
        startJourney: "मेरी वित्तीय यात्रा शुरू करें"
      }
    };
    return translations[language]?.[key] || translations.en[key];
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
          <User className="h-6 w-6 text-primary-foreground" />
        </div>
        <CardTitle className="text-2xl">{getTranslation('welcomeTitle')}</CardTitle>
        <CardDescription>
          {getTranslation('welcomeDesc')}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{getTranslation('name')}</Label>
              <Input
                id="name"
                placeholder={getTranslation('namePlace')}
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">{getTranslation('age')}</Label>
              <Input
                id="age"
                type="number"
                placeholder={getTranslation('agePlace')}
                value={profile.age}
                onChange={(e) => setProfile(prev => ({ ...prev, age: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">{getTranslation('email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={getTranslation('emailPlace')}
                value={profile.email}
                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{getTranslation('phone')}</Label>
              <Input
                id="phone"
                type="tel"
                placeholder={getTranslation('phonePlace')}
                value={profile.phone}
                onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="region">{getTranslation('region')}</Label>
            <Input
              id="region"
              placeholder={getTranslation('regionPlace')}
              value={profile.region}
              onChange={(e) => setProfile(prev => ({ ...prev, region: e.target.value }))}
            />
          </div>
        </div>

        {/* Client Type */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <Label className="text-base font-medium">{getTranslation('clientProfile')}</Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {clientTypes.map((type) => (
              <Card
                key={type.id}
                className={`cursor-pointer transition-all ${
                  profile.clientType === type.id 
                    ? 'border-primary bg-primary-light' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setProfile(prev => ({ ...prev, clientType: type.id }))}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{type.icon}</span>
                    <div>
                      <div className="font-medium">{type.name[language] || type.name.en}</div>
                      <div className="text-sm text-muted-foreground">{type.description[language] || type.description.en}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Accessibility Needs */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Accessibility className="h-4 w-4 text-primary" />
            <Label className="text-base font-medium">{getTranslation('accessibilityNeedsTitle')}</Label>
          </div>
          <div className="flex flex-wrap gap-2">
            {accessibilityNeeds.map((need) => (
              <Badge
                key={need.id}
                variant={profile.accessibilityNeeds.includes(need.id) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleAccessibilityToggle(need.id)}
              >
                <span className="mr-1">{need.icon}</span>
                {need.name[language] || need.name.en}
              </Badge>
            ))}
          </div>
        </div>

        {/* Financial Goals */}
        {profile.clientType && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <Label className="text-base font-medium">{getTranslation('financialGoalsTitle')}</Label>
            </div>
            <div className="flex flex-wrap gap-2">
              {financialGoalsByType[profile.clientType]?.map((goal) => (
                <Badge
                  key={goal.id}
                  variant={profile.financialGoals.includes(goal.id) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleGoalToggle(goal.id)}
                >
                  <span className="mr-1">{goal.icon}</span>
                  {goal.name[language] || goal.name.en}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Experience Level */}
        <div className="space-y-3">
          <Label className="text-base font-medium">{getTranslation('experienceLevel')}</Label>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={profile.experience === 'beginner' ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setProfile(prev => ({ ...prev, experience: 'beginner' }))}
            >
              {getTranslation('beginnerExp')}
            </Badge>
            <Badge
              variant={profile.experience === 'intermediate' ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setProfile(prev => ({ ...prev, experience: 'intermediate' }))}
            >
              {getTranslation('intermediateExp')}
            </Badge>
            <Badge
              variant={profile.experience === 'advanced' ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setProfile(prev => ({ ...prev, experience: 'advanced' }))}
            >
              {getTranslation('advancedExp')}
            </Badge>
          </div>
        </div>

        <Button 
          onClick={handleSubmit}
          className="w-full"
          disabled={!profile.name || !profile.clientType || !profile.phone || loading}
        >
          {loading ? 'Saving...' : getTranslation('startJourney')}
        </Button>
      </CardContent>
    </Card>
  );
};
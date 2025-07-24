import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, User, Target, Globe, Phone, Mail, MapPin, Calendar } from 'lucide-react';

interface PolicyConsentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
  userProfile: any;
  language: string;
}

export const PolicyConsentDialog = ({ 
  open, 
  onOpenChange, 
  onAccept, 
  userProfile, 
  language 
}: PolicyConsentDialogProps) => {
  
  // Translation function
  const getTranslation = (key: string) => {
    const translations = {
      en: {
        title: "Privacy & Data Consent",
        subtitle: "Your data security and privacy matter to us",
        profileReview: "Profile Information Review",
        dataStored: "The following personal information will be securely stored:",
        policyTitle: "Data Protection Policy",
        policyText: "By proceeding, you consent to the collection and processing of your personal information as outlined below:",
        dataUse: "• Your data will be used exclusively to provide personalized financial guidance",
        dataProtection: "• All information is encrypted and stored with bank-level security",
        noSharing: "• We never share your personal data with third parties without explicit consent",
        rightToDelete: "• You can request data deletion or modification at any time",
        compliance: "• Full compliance with data protection regulations and privacy laws",
        acceptButton: "I Accept & Continue to Chat",
        declineButton: "Decline",
        personalInfo: "Personal Information",
        financialProfile: "Financial Profile",
        preferences: "Preferences & Goals"
      },
      hi: {
        title: "गोपनीयता और डेटा सहमति",
        subtitle: "आपकी डेटा सुरक्षा और गोपनीयता हमारे लिए महत्वपूर्ण है",
        profileReview: "प्रोफाइल जानकारी समीक्षा",
        dataStored: "निम्नलिखित व्यक्तिगत जानकारी सुरक्षित रूप से संग्रहीत की जाएगी:",
        policyTitle: "डेटा सुरक्षा नीति",
        policyText: "आगे बढ़कर, आप नीचे दी गई व्यक्तिगत जानकारी के संग्रह और प्रसंस्करण के लिए सहमति देते हैं:",
        dataUse: "• आपका डेटा केवल व्यक्तिगत वित्तीय मार्गदर्शन प्रदान करने के लिए उपयोग किया जाएगा",
        dataProtection: "• सभी जानकारी एन्क्रिप्टेड है और बैंक-स्तरीय सुरक्षा के साथ संग्रहीत है",
        noSharing: "• हम स्पष्ट सहमति के बिना आपका व्यक्तिगत डेटा तीसरे पक्ष के साथ साझा नहीं करते",
        rightToDelete: "• आप किसी भी समय डेटा हटाने या संशोधन का अनुरोध कर सकते हैं",
        compliance: "• डेटा सुरक्षा नियमों और गोपनीयता कानूनों का पूर्ण अनुपालन",
        acceptButton: "मैं स्वीकार करता हूं और चैट जारी रखता हूं",
        declineButton: "अस्वीकार करें",
        personalInfo: "व्यक्तिगत जानकारी",
        financialProfile: "वित्तीय प्रोफाइल",
        preferences: "प्राथमिकताएं और लक्ष्य"
      }
    };
    return translations[language]?.[key] || translations.en[key];
  };

  const clientTypes = {
    farmer: { name: { en: 'Farmer', hi: 'किसान' }, icon: '🌾' },
    student: { name: { en: 'Student | GenZ', hi: 'छात्र | जेन Z' }, icon: '🎓' },
    professional: { name: { en: 'Professionals | Entrepreneurs', hi: 'पेशेवर | उद्यमी' }, icon: '💼' },
    senior: { name: { en: 'Senior Citizen', hi: 'वरिष्ठ नागरिक' }, icon: '👴' },
    'differently-abled': { name: { en: 'Differently Abled', hi: 'दिव्यांग' }, icon: '♿' },
    minority: { name: { en: 'Minority | Worker', hi: 'अल्पसंख्यक/श्रमिक' }, icon: '🤝' }
  };

  const experienceLabels = {
    en: {
      beginner: 'Beginner',
      intermediate: 'Intermediate', 
      advanced: 'Advanced'
    },
    hi: {
      beginner: 'शुरुआती',
      intermediate: 'मध्यम',
      advanced: 'उन्नत'
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {getTranslation('title')}
          </DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground">
            {getTranslation('subtitle')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Review Section */}
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-primary" />
                {getTranslation('profileReview')}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {getTranslation('dataStored')}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Personal Information */}
              <div className="space-y-3">
                <h4 className="font-semibold text-primary flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {getTranslation('personalInfo')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-6">
                  {userProfile.name && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Name:</span> {userProfile.name}
                    </div>
                  )}
                  {userProfile.age && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Age:</span> {userProfile.age}
                    </div>
                  )}
                  {userProfile.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Email:</span> {userProfile.email}
                    </div>
                  )}
                  {userProfile.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Phone:</span> {userProfile.phone}
                    </div>
                  )}
                  {userProfile.region && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Region:</span> {userProfile.region}
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Profile */}
              {userProfile.clientType && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-secondary flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    {getTranslation('financialProfile')}
                  </h4>
                  <div className="ml-6 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{clientTypes[userProfile.clientType]?.icon}</span>
                      <span className="font-medium">
                        {clientTypes[userProfile.clientType]?.name[language] || clientTypes[userProfile.clientType]?.name.en}
                      </span>
                    </div>
                    {userProfile.experience && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">Experience Level:</span>
                        <Badge variant="secondary">
                          {experienceLabels[language]?.[userProfile.experience] || userProfile.experience}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Goals & Preferences */}
              {(userProfile.financialGoals?.length > 0 || userProfile.accessibilityNeeds?.length > 0) && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-accent flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    {getTranslation('preferences')}
                  </h4>
                  <div className="ml-6 space-y-2">
                    {userProfile.financialGoals?.length > 0 && (
                      <div>
                        <span className="text-sm font-medium block mb-1">Financial Goals:</span>
                        <div className="flex flex-wrap gap-1">
                          {userProfile.financialGoals.slice(0, 3).map((goal: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {goal}
                            </Badge>
                          ))}
                          {userProfile.financialGoals.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{userProfile.financialGoals.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    {userProfile.accessibilityNeeds?.length > 0 && (
                      <div>
                        <span className="text-sm font-medium block mb-1">Accessibility Needs:</span>
                        <div className="flex flex-wrap gap-1">
                          {userProfile.accessibilityNeeds.map((need: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {need}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Separator />

          {/* Data Protection Policy */}
          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-accent">
                <Shield className="h-5 w-5" />
                {getTranslation('policyTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {getTranslation('policyText')}
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <span>{getTranslation('dataUse')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <span>{getTranslation('dataProtection')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <span>{getTranslation('noSharing')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <span>{getTranslation('rightToDelete')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <span>{getTranslation('compliance')}</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="flex-1 h-12"
            >
              {getTranslation('declineButton')}
            </Button>
            <Button
              onClick={onAccept}
              className="flex-1 h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold"
            >
              <Shield className="h-4 w-4 mr-2" />
              {getTranslation('acceptButton')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
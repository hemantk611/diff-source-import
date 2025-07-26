import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus, Shield, TrendingUp, Users, Heart, Home, GraduationCap } from 'lucide-react';

const registrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().min(18, 'Age must be at least 18').max(100, 'Age must be less than 100'),
  income: z.number().min(0, 'Income must be a positive number'),
  goals: z.string().min(1, 'Please select at least one goal'),
  riskTolerance: z.enum(['low', 'medium', 'high']),
  language: z.string(),
  emailOrMobile: z.string().min(1, 'Email or mobile is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface RegistrationFormProps {
  onSuccess: (userData: any) => void;
  onCancel: () => void;
  language: string;
}

const clientTypes = [
  {
    id: 'individual',
    name: { en: 'Individual', hi: 'व्यक्तिगत' },
    icon: Users,
    description: { en: 'Personal financial planning', hi: 'व्यक्तिगत वित्तीय योजना' }
  },
  {
    id: 'family',
    name: { en: 'Family', hi: 'परिवार' },
    icon: Home,
    description: { en: 'Family financial management', hi: 'पारिवारिक वित्त प्रबंधन' }
  },
  {
    id: 'business',
    name: { en: 'Business', hi: 'व्यापार' },
    icon: TrendingUp,
    description: { en: 'Business financial guidance', hi: 'व्यापारिक वित्तीय मार्गदर्शन' }
  }
];

const financialGoals = [
  { id: 'retirement', name: { en: 'Retirement Planning', hi: 'सेवानिवृत्ति योजना' }, icon: Shield },
  { id: 'emergency', name: { en: 'Emergency Fund', hi: 'आपातकालीन फंड' }, icon: Heart },
  { id: 'education', name: { en: 'Education Fund', hi: 'शिक्षा फंड' }, icon: GraduationCap },
  { id: 'investment', name: { en: 'Investment Growth', hi: 'निवेश वृद्धि' }, icon: TrendingUp },
];

export const RegistrationForm = ({ onSuccess, onCancel, language }: RegistrationFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClientType, setSelectedClientType] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: '',
      age: 25,
      income: 50000,
      goals: '',
      riskTolerance: 'medium',
      language,
      emailOrMobile: '',
      password: '',
    },
  });

  const getTranslation = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        register: 'Register',
        name: 'Full Name',
        age: 'Age',
        income: 'Annual Income',
        clientType: 'Client Type',
        financialGoals: 'Financial Goals',
        riskTolerance: 'Risk Tolerance',
        low: 'Conservative',
        medium: 'Moderate',
        high: 'Aggressive',
        emailOrMobile: 'Email or Mobile',
        password: 'Password',
        registerButton: 'Register',
        cancel: 'Cancel',
        registrationSuccess: 'Registration successful!',
        registrationError: 'Registration failed. Please try again.',
      },
      hi: {
        register: 'पंजीकरण',
        name: 'पूरा नाम',
        age: 'आयु',
        income: 'वार्षिक आय',
        clientType: 'ग्राहक प्रकार',
        financialGoals: 'वित्तीय लक्ष्य',
        riskTolerance: 'जोखिम सहनशीलता',
        low: 'रूढ़िवादी',
        medium: 'मध्यम',
        high: 'आक्रामक',
        emailOrMobile: 'ईमेल या मोबाइल',
        password: 'पासवर्ड',
        registerButton: 'पंजीकरण करें',
        cancel: 'रद्द करें',
        registrationSuccess: 'पंजीकरण सफल!',
        registrationError: 'पंजीकरण असफल। कृपया पुनः प्रयास करें।',
      },
    };
    
    return translations[language]?.[key] || translations.en[key];
  };

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals(prev => {
      const updated = prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId];
      
      form.setValue('goals', updated.join(','));
      return updated;
    });
  };

  const onSubmit = async (data: RegistrationFormData) => {
    setIsLoading(true);
    try {
      const result = await authService.register({
        name: data.name,
        age: data.age,
        income: data.income,
        goals: data.goals,
        riskTolerance: data.riskTolerance,
        language: data.language,
        emailOrMobile: data.emailOrMobile,
        password: data.password,
      });
      
      if (result.success) {
        toast({
          title: getTranslation('registrationSuccess'),
        });
        onSuccess(data);
      } else {
        toast({
          variant: 'destructive',
          title: result.error || getTranslation('registrationError'),
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: getTranslation('registrationError'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center gap-2">
          <UserPlus className="h-5 w-5" />
          {getTranslation('register')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{getTranslation('name')}</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{getTranslation('age')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="income"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{getTranslation('income')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="50000"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel className="text-base font-medium">
                {getTranslation('clientType')}
              </FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                {clientTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Card
                      key={type.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedClientType === type.id ? 'ring-2 ring-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setSelectedClientType(type.id)}
                    >
                      <CardContent className="p-4 text-center">
                        <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <h3 className="font-medium">{type.name[language as keyof typeof type.name]}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {type.description[language as keyof typeof type.description]}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div>
              <FormLabel className="text-base font-medium">
                {getTranslation('financialGoals')}
              </FormLabel>
              <div className="flex flex-wrap gap-2 mt-2">
                {financialGoals.map((goal) => {
                  const Icon = goal.icon;
                  const isSelected = selectedGoals.includes(goal.id);
                  return (
                    <Badge
                      key={goal.id}
                      variant={isSelected ? 'default' : 'outline'}
                      className="cursor-pointer p-2 h-auto flex items-center gap-1"
                      onClick={() => handleGoalToggle(goal.id)}
                    >
                      <Icon className="h-3 w-3" />
                      {goal.name[language as keyof typeof goal.name]}
                    </Badge>
                  );
                })}
              </div>
            </div>

            <FormField
              control={form.control}
              name="riskTolerance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{getTranslation('riskTolerance')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">{getTranslation('low')}</SelectItem>
                      <SelectItem value="medium">{getTranslation('medium')}</SelectItem>
                      <SelectItem value="high">{getTranslation('high')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="emailOrMobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{getTranslation('emailOrMobile')}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="email@example.com or +1234567890"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{getTranslation('password')}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                {getTranslation('cancel')}
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {getTranslation('registerButton')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
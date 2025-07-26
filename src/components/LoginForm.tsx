import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail } from 'lucide-react';

const loginSchema = z.object({
  emailOrMobile: z.string().min(1, 'Email or mobile is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess: (user: any) => void;
  onCancel: () => void;
  language: string;
}

export const LoginForm = ({ onSuccess, onCancel, language }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrMobile: '',
      password: '',
    },
  });

  const getTranslation = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        login: 'Login',
        emailOrMobile: 'Email or Mobile',
        password: 'Password',
        loginButton: 'Login',
        cancel: 'Cancel',
        loginSuccess: 'Login successful!',
        loginError: 'Login failed. Please check your credentials.',
      },
      hi: {
        login: 'लॉगिन',
        emailOrMobile: 'ईमेल या मोबाइल',
        password: 'पासवर्ड',
        loginButton: 'लॉगिन करें',
        cancel: 'रद्द करें',
        loginSuccess: 'लॉगिन सफल!',
        loginError: 'लॉगिन असफल। कृपया अपनी जानकारी जांचें।',
      },
    };
    
    return translations[language]?.[key] || translations.en[key];
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const result = await authService.login({
        emailOrMobile: data.emailOrMobile,
        password: data.password,
      });
      
      if (result.success && result.data) {
        toast({
          title: getTranslation('loginSuccess'),
        });
        onSuccess(result.data.user);
      } else {
        toast({
          variant: 'destructive',
          title: result.error || getTranslation('loginError'),
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: getTranslation('loginError'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center gap-2">
          <Mail className="h-5 w-5" />
          {getTranslation('login')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                {getTranslation('loginButton')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
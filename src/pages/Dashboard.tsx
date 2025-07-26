import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChatPopup } from '@/components/ChatPopup';
import { authService } from '@/services/authService';
import { GoalPlan, User } from '@/types/auth';
import { MessageCircle } from 'lucide-react';

const Dashboard = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [user, setUser] = useState<User | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [goalPlans] = useState<GoalPlan[]>([
    {
      user_goal: 'Retirement Planning',
      action_plan_name: '401k Optimization',
      plan_duration: '30 years',
      status: 'Active'
    },
    {
      user_goal: 'Emergency Fund',
      action_plan_name: 'High-Yield Savings',
      plan_duration: '6 months',
      status: 'In Progress'
    },
    {
      user_goal: 'Investment Growth',
      action_plan_name: 'Diversified Portfolio',
      plan_duration: '10 years',
      status: 'Planning'
    }
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/');
      return;
    }

    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setSelectedLanguage(currentUser.language || 'en');
    }
  }, [navigate]);

  const getTranslation = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        dashboard: 'Dashboard',
        goalActionPlan: 'Goal Action Plan',
        userGoal: 'User Goal',
        actionPlanName: 'Action Plan Name',
        planDuration: 'Plan Duration',
        status: 'Status',
        openChatbot: 'Open Chatbot',
        welcome: 'Welcome back',
      },
      hi: {
        dashboard: 'डैशबोर्ड',
        goalActionPlan: 'लक्ष्य कार्य योजना',
        userGoal: 'उपयोगकर्ता लक्ष्य',
        actionPlanName: 'कार्य योजना का नाम',
        planDuration: 'योजना अवधि',
        status: 'स्थिति',
        openChatbot: 'चैटबॉट खोलें',
        welcome: 'वापस स्वागत है',
      },
    };
    
    return translations[selectedLanguage]?.[key] || translations.en[key];
  };

  const ChatButtonRenderer = (params: any) => {
    return (
      <Button
        size="sm"
        onClick={() => setIsChatOpen(true)}
        className="h-8"
      >
        <MessageCircle className="h-4 w-4 mr-1" />
        {getTranslation('openChatbot')}
      </Button>
    );
  };

  const columnDefs: ColDef[] = [
    {
      field: 'user_goal',
      headerName: getTranslation('userGoal'),
      flex: 1,
    },
    {
      field: 'action_plan_name',
      headerName: getTranslation('actionPlanName'),
      flex: 1,
    },
    {
      field: 'plan_duration',
      headerName: getTranslation('planDuration'),
      flex: 1,
    },
    {
      field: 'status',
      headerName: getTranslation('status'),
      flex: 1,
    },
    {
      headerName: 'Actions',
      cellRenderer: ChatButtonRenderer,
      flex: 1,
      sortable: false,
      filter: false,
    },
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        user={user}
        showUserInfo={true}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getTranslation('welcome')}, {user.name}!
          </h1>
          <p className="text-gray-600">
            {getTranslation('dashboard')}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{getTranslation('goalActionPlan')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
              <AgGridReact
                rowData={goalPlans}
                columnDefs={columnDefs}
                pagination={true}
                paginationPageSize={10}
                defaultColDef={{
                  sortable: true,
                  filter: true,
                  resizable: true,
                }}
              />
            </div>
          </CardContent>
        </Card>
      </main>

      {isChatOpen && (
        <ChatPopup
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          user={user}
          language={selectedLanguage}
        />
      )}
    </div>
  );
};

export default Dashboard;
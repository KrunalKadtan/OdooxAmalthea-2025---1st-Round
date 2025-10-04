import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Users, 
  Settings, 
  FileText, 
  LogOut, 
  BarChart3, 
  Plus, 
  Sparkles,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  Shield,
  Crown,
  Building,
  Activity
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import UserManagement from './admin/UserManagement';
import WorkflowConfiguration from './admin/WorkflowConfiguration';
import AllExpenses from './admin/AllExpenses';
import AddUserModal from './admin/AddUserModal';

type AdminView = 'overview' | 'users' | 'workflow' | 'expenses';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<AdminView>('overview');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const sidebarItems = [
    { id: 'overview' as AdminView, label: 'Overview', icon: BarChart3 },
    { id: 'users' as AdminView, label: 'User Management', icon: Users },
    { id: 'workflow' as AdminView, label: 'Approval Workflows', icon: Settings },
    { id: 'expenses' as AdminView, label: 'All Expenses', icon: FileText }
  ];

  const OverviewContent = () => {
    const stats = [
      { 
        label: 'Total Users', 
        value: '24', 
        change: '+2 this month',
        icon: Users,
        color: 'blue',
        bgColor: 'from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20',
        borderColor: 'border-l-blue-500'
      },
      { 
        label: 'Pending Expenses', 
        value: '8', 
        change: '3 need urgent review',
        icon: Clock,
        color: 'amber',
        bgColor: 'from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20',
        borderColor: 'border-l-amber-500'
      },
      { 
        label: 'This Month Approved', 
        value: '$12,450', 
        change: '+15% vs last month',
        icon: DollarSign,
        color: 'emerald',
        bgColor: 'from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20',
        borderColor: 'border-l-emerald-500'
      },
      { 
        label: 'Active Workflows', 
        value: '3', 
        change: '2 standard, 1 custom',
        icon: Settings,
        color: 'purple',
        bgColor: 'from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20',
        borderColor: 'border-l-purple-500'
      }
    ];

    const recentActivities = [
      { action: 'New user registered: Sarah Johnson', time: '2 hours ago', icon: Users, color: 'text-blue-600' },
      { action: 'Expense approved: $250 - Hotel stay', time: '4 hours ago', icon: CheckCircle, color: 'text-emerald-600' },
      { action: 'Workflow updated: Travel approval process', time: '1 day ago', icon: Settings, color: 'text-purple-600' },
      { action: 'Bulk expense import completed', time: '2 days ago', icon: FileText, color: 'text-gray-600' },
      { action: 'New manager assigned: Mike Thompson', time: '3 days ago', icon: Shield, color: 'text-indigo-600' }
    ];

    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Dashboard Overview
          </h2>
          <p className="text-muted-foreground text-lg mt-2">Monitor your expense management system performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className={`border-l-4 ${stat.borderColor} bg-gradient-to-br ${stat.bgColor} hover:shadow-lg transition-all duration-200`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium text-${stat.color}-700 dark:text-${stat.color}-400`}>{stat.label}</p>
                      <p className={`text-2xl font-bold text-${stat.color}-900 dark:text-${stat.color}-300`}>{stat.value}</p>
                    </div>
                    <IconComponent className={`h-8 w-8 text-${stat.color}-500`} />
                  </div>
                  <p className={`text-xs text-${stat.color}-600 dark:text-${stat.color}-500 mt-2`}>{stat.change}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Activity className="h-5 w-5 text-blue-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className={`w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center`}>
                        <IconComponent className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <QuickActionsCard 
            onAddUser={() => setShowAddUserModal(true)}
            onConfigureWorkflow={() => setCurrentView('workflow')}
            onExportReport={() => alert('Export functionality would be implemented here')}
            onViewAnalytics={() => alert('Analytics view would be implemented here')}
          />
        </div>

        <AddUserModal 
          isOpen={showAddUserModal}
          onClose={() => setShowAddUserModal(false)}
          onAddUser={(userData) => {
            console.log('Adding user:', userData);
            alert('User added successfully!');
          }}
        />
      </div>
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return <OverviewContent />;
      case 'users':
        return <UserManagement />;
      case 'workflow':
        return <WorkflowConfiguration />;
      case 'expenses':
        return <AllExpenses />;
      default:
        return <OverviewContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user?.fullName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/settings')}
                className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 dark:hover:bg-blue-950/20 dark:hover:border-blue-800 dark:hover:text-blue-400"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              <ThemeToggle />
              <Button
                variant="outline"
                onClick={logout}
                className="flex items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:border-red-800 dark:hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <Button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                variant={isActive ? "default" : "outline"}
                className={`flex items-center gap-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 dark:hover:bg-blue-950/20 dark:hover:border-blue-800 dark:hover:text-blue-400'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </div>

        {/* Main Content */}
        {renderContent()}
      </div>
    </div>
  );
}

function QuickActionsCard({ 
  onAddUser, 
  onConfigureWorkflow, 
  onExportReport, 
  onViewAnalytics 
}: {
  onAddUser: () => void;
  onConfigureWorkflow: () => void;
  onExportReport: () => void;
  onViewAnalytics: () => void;
}) {
  const actions = [
    {
      label: 'Add New User',
      icon: Users,
      onClick: onAddUser,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      label: 'Configure Workflow',
      icon: Settings,
      onClick: onConfigureWorkflow,
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700'
    },
    {
      label: 'Export Report',
      icon: FileText,
      onClick: onExportReport,
      color: 'from-emerald-500 to-emerald-600',
      hoverColor: 'hover:from-emerald-600 hover:to-emerald-700'
    },
    {
      label: 'View Analytics',
      icon: BarChart3,
      onClick: onViewAnalytics,
      color: 'from-amber-500 to-amber-600',
      hoverColor: 'hover:from-amber-600 hover:to-amber-700'
    }
  ];

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="h-5 w-5 text-purple-500" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <Button 
              key={index}
              className={`w-full justify-start h-12 bg-gradient-to-r ${action.color} ${action.hoverColor} text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200`}
              onClick={action.onClick}
            >
              <IconComponent className="mr-3 h-5 w-5" />
              {action.label}
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
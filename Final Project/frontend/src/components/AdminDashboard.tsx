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
  Activity,
  Cog
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex">
      {/* Sidebar */}
      <div className="w-72 bg-gradient-to-b from-gray-900 to-gray-800 dark:from-gray-900 dark:to-black shadow-2xl border-r border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
              <p className="text-sm text-gray-300">ExpenseFlow</p>
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{user?.fullName}</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/settings')}
              className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-gray-800/50"
            >
              <Cog className="h-4 w-4" />
              Settings
            </Button>
            <ThemeToggle variant="ghost" size="sm" />
          </div>
        </div>
        
        <nav className="mt-6 flex-1 px-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                  {item.label}
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <Button 
            variant="outline" 
            onClick={logout} 
            className="w-full flex items-center gap-2 bg-transparent border-gray-600 text-gray-300 hover:bg-red-600/10 hover:border-red-500 hover:text-red-400 transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
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
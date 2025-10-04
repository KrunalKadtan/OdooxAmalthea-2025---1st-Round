import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Slider } from './ui/slider';
import { 
  User, 
  Mail, 
  Globe, 
  Palette, 
  Bell, 
  Shield, 
  Save,
  LogOut,
  Sparkles,
  Settings,
  DollarSign,
  Languages,
  Clock,
  Eye,
  Download,
  Users,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  FileText
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { toast } from 'sonner';

interface ManagerSettingsProps {
  onBack: () => void;
}

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' }
];

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' }
];

export default function ManagerSettings({ onBack }: ManagerSettingsProps) {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  
  const [settings, setSettings] = useState({
    // Personal Information
    fullName: user?.fullName || '',
    email: user?.email || '',
    
    // Preferences
    preferredCurrency: 'USD',
    language: 'en',
    timezone: 'UTC',
    
    // Manager-specific Settings
    autoApprovalLimit: [500], // Slider value as array
    requireReceiptsAbove: [100],
    approvalTimeoutDays: 7,
    
    // Team Management
    teamVisibility: 'full',
    allowTeamExpenseView: true,
    requireApprovalComments: false,
    enableBulkApproval: true,
    
    // Notifications
    emailNotifications: true,
    pendingExpenseAlerts: true,
    teamExpenseDigest: true,
    budgetAlerts: true,
    escalationNotifications: true,
    weeklyTeamReports: true,
    
    // Dashboard Preferences
    defaultDashboardView: 'pending',
    showTeamStats: true,
    showBudgetProgress: true,
    compactView: false,
    
    // Approval Workflow
    requireSecondApproval: false,
    secondApprovalLimit: [1000],
    allowDelegation: true,
    delegateApprovals: false,
    
    // Reporting
    monthlyReports: true,
    expenseAnalytics: true,
    teamPerformanceReports: false,
    budgetVarianceReports: true
  });

  const handleSave = () => {
    toast.success('Manager settings saved successfully!');
  };

  const handleReset = () => {
    setSettings({
      ...settings,
      fullName: user?.fullName || '',
      email: user?.email || '',
      preferredCurrency: 'USD',
      language: 'en',
      timezone: 'UTC',
      autoApprovalLimit: [500],
      requireReceiptsAbove: [100]
    });
    toast.info('Settings reset to defaults');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="mr-2">
                ← Back
              </Button>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Manager Settings
                </h1>
                <p className="text-sm text-muted-foreground">Configure team management preferences</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button variant="outline" onClick={logout} className="flex items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:border-red-800 dark:hover:text-red-400">
                <LogOut className="h-4 w-4" />
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Profile Section */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <User className="h-5 w-5 text-blue-500" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-2xl">
                  {getInitials(settings.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{settings.fullName}</h3>
                <p className="text-muted-foreground">{settings.email}</p>
                <Badge className="mt-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  Manager
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={settings.fullName}
                  onChange={(e) => setSettings({...settings, fullName: e.target.value})}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({...settings, email: e.target.value})}
                  className="h-12"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Approval Settings */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Approval Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-semibold">Auto-Approval Limit</Label>
                <p className="text-sm text-muted-foreground">Automatically approve expenses below this amount</p>
                <div className="px-3">
                  <Slider
                    value={settings.autoApprovalLimit}
                    onValueChange={(value) => setSettings({...settings, autoApprovalLimit: value})}
                    max={2000}
                    min={0}
                    step={50}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>$0</span>
                    <span className="font-semibold text-green-600">${settings.autoApprovalLimit[0]}</span>
                    <span>$2000</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Receipt Required Above</Label>
                <p className="text-sm text-muted-foreground">Require receipt attachments for expenses above this amount</p>
                <div className="px-3">
                  <Slider
                    value={settings.requireReceiptsAbove}
                    onValueChange={(value) => setSettings({...settings, requireReceiptsAbove: value})}
                    max={500}
                    min={0}
                    step={25}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>$0</span>
                    <span className="font-semibold text-amber-600">${settings.requireReceiptsAbove[0]}</span>
                    <span>$500</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Approval Timeout (Days)</Label>
                  <Select value={settings.approvalTimeoutDays.toString()} onValueChange={(value) => setSettings({...settings, approvalTimeoutDays: parseInt(value)})}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Days</SelectItem>
                      <SelectItem value="5">5 Days</SelectItem>
                      <SelectItem value="7">7 Days</SelectItem>
                      <SelectItem value="14">14 Days</SelectItem>
                      <SelectItem value="30">30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Bulk Approval</Label>
                    <p className="text-sm text-muted-foreground">Approve multiple expenses at once</p>
                  </div>
                  <Switch
                    checked={settings.enableBulkApproval}
                    onCheckedChange={(checked) => setSettings({...settings, enableBulkApproval: checked})}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Management */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Users className="h-5 w-5 text-purple-500" />
              Team Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Team Visibility</Label>
                <Select value={settings.teamVisibility} onValueChange={(value) => setSettings({...settings, teamVisibility: value})}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Access</SelectItem>
                    <SelectItem value="limited">Limited Access</SelectItem>
                    <SelectItem value="expenses-only">Expenses Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow Team Expense View</Label>
                  <p className="text-sm text-muted-foreground">Team can view each other's expenses</p>
                </div>
                <Switch
                  checked={settings.allowTeamExpenseView}
                  onCheckedChange={(checked) => setSettings({...settings, allowTeamExpenseView: checked})}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Approval Comments</Label>
                  <p className="text-sm text-muted-foreground">Mandatory comments when approving/rejecting</p>
                </div>
                <Switch
                  checked={settings.requireApprovalComments}
                  onCheckedChange={(checked) => setSettings({...settings, requireApprovalComments: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow Delegation</Label>
                  <p className="text-sm text-muted-foreground">Delegate approval authority to others</p>
                </div>
                <Switch
                  checked={settings.allowDelegation}
                  onCheckedChange={(checked) => setSettings({...settings, allowDelegation: checked})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Bell className="h-5 w-5 text-amber-500" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-base">Approval Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Pending Expense Alerts</Label>
                      <p className="text-sm text-muted-foreground">New expenses awaiting approval</p>
                    </div>
                    <Switch
                      checked={settings.pendingExpenseAlerts}
                      onCheckedChange={(checked) => setSettings({...settings, pendingExpenseAlerts: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Escalation Notifications</Label>
                      <p className="text-sm text-muted-foreground">Overdue approval reminders</p>
                    </div>
                    <Switch
                      checked={settings.escalationNotifications}
                      onCheckedChange={(checked) => setSettings({...settings, escalationNotifications: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Budget Alerts</Label>
                      <p className="text-sm text-muted-foreground">Team budget threshold warnings</p>
                    </div>
                    <Switch
                      checked={settings.budgetAlerts}
                      onCheckedChange={(checked) => setSettings({...settings, budgetAlerts: checked})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-base">Team Reports</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Team Expense Digest</Label>
                      <p className="text-sm text-muted-foreground">Daily team expense summary</p>
                    </div>
                    <Switch
                      checked={settings.teamExpenseDigest}
                      onCheckedChange={(checked) => setSettings({...settings, teamExpenseDigest: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Weekly Team Reports</Label>
                      <p className="text-sm text-muted-foreground">Comprehensive weekly summaries</p>
                    </div>
                    <Switch
                      checked={settings.weeklyTeamReports}
                      onCheckedChange={(checked) => setSettings({...settings, weeklyTeamReports: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Monthly Reports</Label>
                      <p className="text-sm text-muted-foreground">Detailed monthly analytics</p>
                    </div>
                    <Switch
                      checked={settings.monthlyReports}
                      onCheckedChange={(checked) => setSettings({...settings, monthlyReports: checked})}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Preferences */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <BarChart3 className="h-5 w-5 text-indigo-500" />
              Dashboard Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Default Dashboard View</Label>
                <Select value={settings.defaultDashboardView} onValueChange={(value) => setSettings({...settings, defaultDashboardView: value})}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending Approvals</SelectItem>
                    <SelectItem value="team">Team Overview</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                    <SelectItem value="budget">Budget Tracking</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Team Statistics</Label>
                    <p className="text-sm text-muted-foreground">Display team performance metrics</p>
                  </div>
                  <Switch
                    checked={settings.showTeamStats}
                    onCheckedChange={(checked) => setSettings({...settings, showTeamStats: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Budget Progress</Label>
                    <p className="text-sm text-muted-foreground">Display budget utilization charts</p>
                  </div>
                  <Switch
                    checked={settings.showBudgetProgress}
                    onCheckedChange={(checked) => setSettings({...settings, showBudgetProgress: checked})}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* General Preferences */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Palette className="h-5 w-5 text-pink-500" />
              General Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  Preferred Currency
                </Label>
                <Select value={settings.preferredCurrency} onValueChange={(value) => setSettings({...settings, preferredCurrency: value})}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Languages className="h-4 w-4 text-blue-600" />
                  Language
                </Label>
                <Select value={settings.language} onValueChange={(value) => setSettings({...settings, language: value})}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  Timezone
                </Label>
                <Select value={settings.timezone} onValueChange={(value) => setSettings({...settings, timezone: value})}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="EST">EST</SelectItem>
                    <SelectItem value="PST">PST</SelectItem>
                    <SelectItem value="GMT">GMT</SelectItem>
                    <SelectItem value="CET">CET</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Button variant="outline" onClick={handleReset} className="h-12 px-8">
            Reset to Defaults
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack} className="h-12 px-8">
              Cancel
            </Button>
            <Button onClick={handleSave} className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
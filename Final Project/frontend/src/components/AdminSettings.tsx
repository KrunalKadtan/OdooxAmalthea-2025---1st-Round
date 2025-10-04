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
import { Textarea } from './ui/textarea';
import { 
  User, 
  Mail, 
  Globe, 
  Palette, 
  Bell, 
  Shield, 
  Save,
  LogOut,
  Settings,
  DollarSign,
  Languages,
  Clock,
  Eye,
  Download,
  Users,
  Building,
  Database,
  Server,
  Lock,
  Key,
  AlertTriangle,
  BarChart3,
  FileText,
  Zap,
  Crown,
  Cog,
  Activity,
  HardDrive,
  Wifi,
  Mail as MailIcon
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { toast } from 'sonner';

interface AdminSettingsProps {
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

export default function AdminSettings({ onBack }: AdminSettingsProps) {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  
  const [settings, setSettings] = useState({
    // Personal Information
    fullName: user?.fullName || '',
    email: user?.email || '',
    
    // Organization Settings
    organizationName: 'Acme Corporation',
    organizationDomain: 'acme.com',
    organizationLogo: '',
    organizationAddress: '',
    taxId: '',
    
    // System Configuration
    defaultCurrency: 'USD',
    defaultLanguage: 'en',
    defaultTimezone: 'UTC',
    fiscalYearStart: 'january',
    
    // User Management
    allowSelfRegistration: false,
    requireEmailVerification: true,
    passwordComplexity: 'medium',
    sessionTimeout: [30], // Slider value
    maxLoginAttempts: 5,
    enableTwoFactor: true,
    
    // Expense Policies
    globalExpenseLimit: [5000],
    requireReceiptsAbove: [100],
    autoApprovalLimit: [500],
    expenseCategories: 'default',
    allowPersonalExpenses: false,
    
    // Approval Workflow
    requireManagerApproval: true,
    requireFinanceApproval: true,
    financeApprovalLimit: [1000],
    escalationTimeoutDays: 7,
    allowBulkApproval: true,
    
    // Integration Settings
    enableApiAccess: true,
    webhookNotifications: false,
    ssoEnabled: false,
    ldapIntegration: false,
    
    // Notifications & Communications
    systemNotifications: true,
    maintenanceNotifications: true,
    securityAlerts: true,
    emailServerConfig: 'default',
    smsNotifications: false,
    
    // Data & Privacy
    dataRetentionPeriod: 7, // years
    enableAuditLogging: true,
    allowDataExport: true,
    gdprCompliance: true,
    encryptionEnabled: true,
    
    // Reporting & Analytics
    enableAdvancedReporting: true,
    realTimeAnalytics: true,
    customDashboards: true,
    dataVisualization: true,
    exportFormats: ['pdf', 'excel', 'csv'],
    
    // System Performance
    enableCaching: true,
    compressionEnabled: true,
    cdnEnabled: false,
    backupFrequency: 'daily',
    
    // Mobile App Settings
    allowMobileAccess: true,
    mobileAppBranding: true,
    offlineModeEnabled: true,
    pushNotificationsEnabled: true,
    
    // Compliance & Security
    complianceMode: 'standard',
    securityLevel: 'high',
    ipWhitelisting: false,
    deviceManagement: false,
    
    // Feature Flags
    betaFeatures: false,
    experimentalFeatures: false,
    aiFeatures: true,
    advancedWorkflows: true
  });

  const handleSave = () => {
    toast.success('Admin settings saved successfully!');
  };

  const handleReset = () => {
    toast.info('Settings reset to defaults');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50/50 via-white to-orange-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="mr-2">
                ← Back
              </Button>
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  Admin Settings
                </h1>
                <p className="text-sm text-muted-foreground">System-wide configuration and management</p>
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Profile Section */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <User className="h-5 w-5 text-red-500" />
              Administrator Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-gradient-to-br from-red-500 to-orange-600 text-white font-bold text-2xl">
                  {getInitials(settings.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{settings.fullName}</h3>
                <p className="text-muted-foreground">{settings.email}</p>
                <Badge className="mt-2 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                  System Administrator
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

        {/* Organization Settings */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Building className="h-5 w-5 text-blue-500" />
              Organization Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Organization Name</Label>
                <Input
                  value={settings.organizationName}
                  onChange={(e) => setSettings({...settings, organizationName: e.target.value})}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label>Domain</Label>
                <Input
                  value={settings.organizationDomain}
                  onChange={(e) => setSettings({...settings, organizationDomain: e.target.value})}
                  className="h-12"
                  placeholder="company.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Tax ID</Label>
                <Input
                  value={settings.taxId}
                  onChange={(e) => setSettings({...settings, taxId: e.target.value})}
                  className="h-12"
                  placeholder="XX-XXXXXXX"
                />
              </div>
              <div className="space-y-2">
                <Label>Fiscal Year Start</Label>
                <Select value={settings.fiscalYearStart} onValueChange={(value) => setSettings({...settings, fiscalYearStart: value})}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="january">January</SelectItem>
                    <SelectItem value="april">April</SelectItem>
                    <SelectItem value="july">July</SelectItem>
                    <SelectItem value="october">October</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Organization Address</Label>
              <Textarea
                value={settings.organizationAddress}
                onChange={(e) => setSettings({...settings, organizationAddress: e.target.value})}
                className="min-h-[80px]"
                placeholder="Enter complete organization address"
              />
            </div>
          </CardContent>
        </Card>

        {/* System Configuration */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Cog className="h-5 w-5 text-purple-500" />
              System Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  Default Currency
                </Label>
                <Select value={settings.defaultCurrency} onValueChange={(value) => setSettings({...settings, defaultCurrency: value})}>
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
                  Default Language
                </Label>
                <Select value={settings.defaultLanguage} onValueChange={(value) => setSettings({...settings, defaultLanguage: value})}>
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
                  Default Timezone
                </Label>
                <Select value={settings.defaultTimezone} onValueChange={(value) => setSettings({...settings, defaultTimezone: value})}>
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

        {/* User Management */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Users className="h-5 w-5 text-indigo-500" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Self Registration</Label>
                    <p className="text-sm text-muted-foreground">Users can create accounts themselves</p>
                  </div>
                  <Switch
                    checked={settings.allowSelfRegistration}
                    onCheckedChange={(checked) => setSettings({...settings, allowSelfRegistration: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Email Verification</Label>
                    <p className="text-sm text-muted-foreground">Verify email addresses on signup</p>
                  </div>
                  <Switch
                    checked={settings.requireEmailVerification}
                    onCheckedChange={(checked) => setSettings({...settings, requireEmailVerification: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Two-Factor Auth</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
                  </div>
                  <Switch
                    checked={settings.enableTwoFactor}
                    onCheckedChange={(checked) => setSettings({...settings, enableTwoFactor: checked})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Password Complexity</Label>
                  <Select value={settings.passwordComplexity} onValueChange={(value) => setSettings({...settings, passwordComplexity: value})}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (8+ characters)</SelectItem>
                      <SelectItem value="medium">Medium (8+ chars, mixed case)</SelectItem>
                      <SelectItem value="high">High (12+ chars, symbols)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Max Login Attempts</Label>
                  <Select value={settings.maxLoginAttempts.toString()} onValueChange={(value) => setSettings({...settings, maxLoginAttempts: parseInt(value)})}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 attempts</SelectItem>
                      <SelectItem value="5">5 attempts</SelectItem>
                      <SelectItem value="10">10 attempts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Session Timeout (Minutes)</Label>
              <div className="px-3">
                <Slider
                  value={settings.sessionTimeout}
                  onValueChange={(value) => setSettings({...settings, sessionTimeout: value})}
                  max={240}
                  min={15}
                  step={15}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>15 min</span>
                  <span className="font-semibold text-indigo-600">{settings.sessionTimeout[0]} minutes</span>
                  <span>4 hours</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expense Policies */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5 text-green-500" />
              Expense Policies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-semibold">Global Expense Limit</Label>
                <p className="text-sm text-muted-foreground">Maximum expense amount per transaction</p>
                <div className="px-3">
                  <Slider
                    value={settings.globalExpenseLimit}
                    onValueChange={(value) => setSettings({...settings, globalExpenseLimit: value})}
                    max={10000}
                    min={100}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>$100</span>
                    <span className="font-semibold text-green-600">${settings.globalExpenseLimit[0]}</span>
                    <span>$10,000</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Receipt Required Above</Label>
                <p className="text-sm text-muted-foreground">Require receipts for expenses above this amount</p>
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
                  <Label>Expense Categories</Label>
                  <Select value={settings.expenseCategories} onValueChange={(value) => setSettings({...settings, expenseCategories: value})}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default Categories</SelectItem>
                      <SelectItem value="custom">Custom Categories</SelectItem>
                      <SelectItem value="industry">Industry Specific</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Personal Expenses</Label>
                    <p className="text-sm text-muted-foreground">Users can submit personal expenses</p>
                  </div>
                  <Switch
                    checked={settings.allowPersonalExpenses}
                    onCheckedChange={(checked) => setSettings({...settings, allowPersonalExpenses: checked})}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security & Compliance */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Shield className="h-5 w-5 text-red-500" />
              Security & Compliance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Security Level</Label>
                  <Select value={settings.securityLevel} onValueChange={(value) => setSettings({...settings, securityLevel: value})}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Compliance Mode</Label>
                  <Select value={settings.complianceMode} onValueChange={(value) => setSettings({...settings, complianceMode: value})}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="sox">SOX Compliance</SelectItem>
                      <SelectItem value="hipaa">HIPAA Compliance</SelectItem>
                      <SelectItem value="gdpr">GDPR Compliance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Data Retention (Years)</Label>
                  <Select value={settings.dataRetentionPeriod.toString()} onValueChange={(value) => setSettings({...settings, dataRetentionPeriod: parseInt(value)})}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Year</SelectItem>
                      <SelectItem value="3">3 Years</SelectItem>
                      <SelectItem value="5">5 Years</SelectItem>
                      <SelectItem value="7">7 Years</SelectItem>
                      <SelectItem value="10">10 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Audit Logging</Label>
                    <p className="text-sm text-muted-foreground">Log all system activities</p>
                  </div>
                  <Switch
                    checked={settings.enableAuditLogging}
                    onCheckedChange={(checked) => setSettings({...settings, enableAuditLogging: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Encryption Enabled</Label>
                    <p className="text-sm text-muted-foreground">Encrypt sensitive data at rest</p>
                  </div>
                  <Switch
                    checked={settings.encryptionEnabled}
                    onCheckedChange={(checked) => setSettings({...settings, encryptionEnabled: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>IP Whitelisting</Label>
                    <p className="text-sm text-muted-foreground">Restrict access by IP address</p>
                  </div>
                  <Switch
                    checked={settings.ipWhitelisting}
                    onCheckedChange={(checked) => setSettings({...settings, ipWhitelisting: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>GDPR Compliance</Label>
                    <p className="text-sm text-muted-foreground">Enable GDPR compliance features</p>
                  </div>
                  <Switch
                    checked={settings.gdprCompliance}
                    onCheckedChange={(checked) => setSettings({...settings, gdprCompliance: checked})}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Performance */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Activity className="h-5 w-5 text-orange-500" />
              System Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Caching</Label>
                    <p className="text-sm text-muted-foreground">Improve performance with caching</p>
                  </div>
                  <Switch
                    checked={settings.enableCaching}
                    onCheckedChange={(checked) => setSettings({...settings, enableCaching: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Compression Enabled</Label>
                    <p className="text-sm text-muted-foreground">Compress data transfers</p>
                  </div>
                  <Switch
                    checked={settings.compressionEnabled}
                    onCheckedChange={(checked) => setSettings({...settings, compressionEnabled: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>CDN Enabled</Label>
                    <p className="text-sm text-muted-foreground">Use content delivery network</p>
                  </div>
                  <Switch
                    checked={settings.cdnEnabled}
                    onCheckedChange={(checked) => setSettings({...settings, cdnEnabled: checked})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Backup Frequency</Label>
                  <Select value={settings.backupFrequency} onValueChange={(value) => setSettings({...settings, backupFrequency: value})}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Real-time Analytics</Label>
                    <p className="text-sm text-muted-foreground">Enable real-time data processing</p>
                  </div>
                  <Switch
                    checked={settings.realTimeAnalytics}
                    onCheckedChange={(checked) => setSettings({...settings, realTimeAnalytics: checked})}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Management */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Zap className="h-5 w-5 text-yellow-500" />
              Feature Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>AI Features</Label>
                    <p className="text-sm text-muted-foreground">Enable AI-powered features</p>
                  </div>
                  <Switch
                    checked={settings.aiFeatures}
                    onCheckedChange={(checked) => setSettings({...settings, aiFeatures: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Advanced Workflows</Label>
                    <p className="text-sm text-muted-foreground">Complex approval workflows</p>
                  </div>
                  <Switch
                    checked={settings.advancedWorkflows}
                    onCheckedChange={(checked) => setSettings({...settings, advancedWorkflows: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Beta Features</Label>
                    <p className="text-sm text-muted-foreground">Enable beta features for testing</p>
                  </div>
                  <Switch
                    checked={settings.betaFeatures}
                    onCheckedChange={(checked) => setSettings({...settings, betaFeatures: checked})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Advanced Reporting</Label>
                    <p className="text-sm text-muted-foreground">Detailed analytics and reports</p>
                  </div>
                  <Switch
                    checked={settings.enableAdvancedReporting}
                    onCheckedChange={(checked) => setSettings({...settings, enableAdvancedReporting: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Custom Dashboards</Label>
                    <p className="text-sm text-muted-foreground">Allow custom dashboard creation</p>
                  </div>
                  <Switch
                    checked={settings.customDashboards}
                    onCheckedChange={(checked) => setSettings({...settings, customDashboards: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mobile App Access</Label>
                    <p className="text-sm text-muted-foreground">Enable mobile application</p>
                  </div>
                  <Switch
                    checked={settings.allowMobileAccess}
                    onCheckedChange={(checked) => setSettings({...settings, allowMobileAccess: checked})}
                  />
                </div>
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
            <Button onClick={handleSave} className="h-12 px-8 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
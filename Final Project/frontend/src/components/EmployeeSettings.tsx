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
  Settings,
  DollarSign,
  Languages,
  Clock,
  Eye,
  Download,
  Receipt,
  CreditCard,
  MapPin,
  Phone,
  Building,
  FileText,
  Camera,
  Smartphone
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { toast } from 'sonner';

interface EmployeeSettingsProps {
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

export default function EmployeeSettings({ onBack }: EmployeeSettingsProps) {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  
  const [settings, setSettings] = useState({
    // Personal Information
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    department: '',
    employeeId: '',
    
    // Preferences
    preferredCurrency: 'USD',
    language: 'en',
    timezone: 'UTC',
    
    // Expense Settings
    defaultExpenseCategory: 'meals',
    autoReceiptCapture: true,
    requireReceiptReminder: true,
    expenseReminderDays: [3], // Slider value
    defaultPaymentMethod: 'company-card',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    expenseStatusUpdates: true,
    approvalNotifications: true,
    reminderNotifications: true,
    weeklyExpenseSummary: false,
    monthlyReports: false,
    
    // Privacy & Security
    shareExpenseData: false,
    allowLocationTracking: true,
    biometricAuth: false,
    sessionTimeout: 30,
    
    // App Preferences
    compactView: false,
    showExpensePreview: true,
    autoSaveExpenses: true,
    offlineMode: true,
    
    // Receipt Settings
    autoUploadReceipts: true,
    receiptQuality: 'high',
    cropReceiptsAutomatically: true,
    ocrEnabled: true,
    
    // Reporting
    includeInTeamReports: true,
    shareSpendingInsights: false,
    exportDataFormat: 'pdf'
  });

  const handleSave = () => {
    toast.success('Employee settings saved successfully!');
  };

  const handleReset = () => {
    setSettings({
      ...settings,
      fullName: user?.fullName || '',
      email: user?.email || '',
      preferredCurrency: 'USD',
      language: 'en',
      timezone: 'UTC',
      expenseReminderDays: [3]
    });
    toast.info('Settings reset to defaults');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-blue-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="mr-2">
                ← Back
              </Button>
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Employee Settings
                </h1>
                <p className="text-sm text-muted-foreground">Manage your personal preferences</p>
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
              <User className="h-5 w-5 text-green-500" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-600 text-white font-bold text-2xl">
                  {getInitials(settings.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{settings.fullName}</h3>
                <p className="text-muted-foreground">{settings.email}</p>
                <Badge className="mt-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  Employee
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
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => setSettings({...settings, phone: e.target.value})}
                  className="h-12"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={settings.department} onValueChange={(value) => setSettings({...settings, department: value})}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="hr">Human Resources</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expense Settings */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Receipt className="h-5 w-5 text-blue-500" />
              Expense Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Default Expense Category</Label>
                <Select value={settings.defaultExpenseCategory} onValueChange={(value) => setSettings({...settings, defaultExpenseCategory: value})}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meals">Meals & Entertainment</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="office">Office Supplies</SelectItem>
                    <SelectItem value="transport">Transportation</SelectItem>
                    <SelectItem value="accommodation">Accommodation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Default Payment Method</Label>
                <Select value={settings.defaultPaymentMethod} onValueChange={(value) => setSettings({...settings, defaultPaymentMethod: value})}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="company-card">Company Card</SelectItem>
                    <SelectItem value="personal-card">Personal Card</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Expense Reminder (Days)</Label>
              <p className="text-sm text-muted-foreground">Get reminded to submit expenses after this many days</p>
              <div className="px-3">
                <Slider
                  value={settings.expenseReminderDays}
                  onValueChange={(value) => setSettings({...settings, expenseReminderDays: value})}
                  max={14}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>1 Day</span>
                  <span className="font-semibold text-blue-600">{settings.expenseReminderDays[0]} Days</span>
                  <span>14 Days</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto Receipt Capture</Label>
                  <p className="text-sm text-muted-foreground">Automatically capture receipts when taking photos</p>
                </div>
                <Switch
                  checked={settings.autoReceiptCapture}
                  onCheckedChange={(checked) => setSettings({...settings, autoReceiptCapture: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Receipt Reminder</Label>
                  <p className="text-sm text-muted-foreground">Remind to attach receipts for expenses</p>
                </div>
                <Switch
                  checked={settings.requireReceiptReminder}
                  onCheckedChange={(checked) => setSettings({...settings, requireReceiptReminder: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto Save Expenses</Label>
                  <p className="text-sm text-muted-foreground">Automatically save expense drafts</p>
                </div>
                <Switch
                  checked={settings.autoSaveExpenses}
                  onCheckedChange={(checked) => setSettings({...settings, autoSaveExpenses: checked})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Receipt Settings */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Camera className="h-5 w-5 text-purple-500" />
              Receipt Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Receipt Quality</Label>
                <Select value={settings.receiptQuality} onValueChange={(value) => setSettings({...settings, receiptQuality: value})}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (Faster upload)</SelectItem>
                    <SelectItem value="medium">Medium (Balanced)</SelectItem>
                    <SelectItem value="high">High (Best quality)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Upload Receipts</Label>
                    <p className="text-sm text-muted-foreground">Upload receipts immediately after capture</p>
                  </div>
                  <Switch
                    checked={settings.autoUploadReceipts}
                    onCheckedChange={(checked) => setSettings({...settings, autoUploadReceipts: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Crop Receipts</Label>
                    <p className="text-sm text-muted-foreground">Automatically crop receipt boundaries</p>
                  </div>
                  <Switch
                    checked={settings.cropReceiptsAutomatically}
                    onCheckedChange={(checked) => setSettings({...settings, cropReceiptsAutomatically: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>OCR Text Recognition</Label>
                    <p className="text-sm text-muted-foreground">Extract text from receipt images</p>
                  </div>
                  <Switch
                    checked={settings.ocrEnabled}
                    onCheckedChange={(checked) => setSettings({...settings, ocrEnabled: checked})}
                  />
                </div>
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
                <h4 className="font-semibold text-base">General Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Mobile app push notifications</p>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => setSettings({...settings, pushNotifications: checked})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-base">Expense Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Status Updates</Label>
                      <p className="text-sm text-muted-foreground">Expense approval/rejection updates</p>
                    </div>
                    <Switch
                      checked={settings.expenseStatusUpdates}
                      onCheckedChange={(checked) => setSettings({...settings, expenseStatusUpdates: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Reminder Notifications</Label>
                      <p className="text-sm text-muted-foreground">Reminders for pending expenses</p>
                    </div>
                    <Switch
                      checked={settings.reminderNotifications}
                      onCheckedChange={(checked) => setSettings({...settings, reminderNotifications: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Weekly Summary</Label>
                      <p className="text-sm text-muted-foreground">Weekly expense summary emails</p>
                    </div>
                    <Switch
                      checked={settings.weeklyExpenseSummary}
                      onCheckedChange={(checked) => setSettings({...settings, weeklyExpenseSummary: checked})}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Shield className="h-5 w-5 text-red-500" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Session Timeout (minutes)</Label>
                <Select value={settings.sessionTimeout.toString()} onValueChange={(value) => setSettings({...settings, sessionTimeout: parseInt(value)})}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="0">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Location Tracking</Label>
                    <p className="text-sm text-muted-foreground">Allow location data for expenses</p>
                  </div>
                  <Switch
                    checked={settings.allowLocationTracking}
                    onCheckedChange={(checked) => setSettings({...settings, allowLocationTracking: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Biometric Authentication</Label>
                    <p className="text-sm text-muted-foreground">Use fingerprint/face ID</p>
                  </div>
                  <Switch
                    checked={settings.biometricAuth}
                    onCheckedChange={(checked) => setSettings({...settings, biometricAuth: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Share Expense Data</Label>
                    <p className="text-sm text-muted-foreground">Allow anonymized data sharing</p>
                  </div>
                  <Switch
                    checked={settings.shareExpenseData}
                    onCheckedChange={(checked) => setSettings({...settings, shareExpenseData: checked})}
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

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Compact View</Label>
                    <p className="text-sm text-muted-foreground">Use compact layout for lists</p>
                  </div>
                  <Switch
                    checked={settings.compactView}
                    onCheckedChange={(checked) => setSettings({...settings, compactView: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Expense Preview</Label>
                    <p className="text-sm text-muted-foreground">Preview expenses before submission</p>
                  </div>
                  <Switch
                    checked={settings.showExpensePreview}
                    onCheckedChange={(checked) => setSettings({...settings, showExpensePreview: checked})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Offline Mode</Label>
                    <p className="text-sm text-muted-foreground">Allow offline expense creation</p>
                  </div>
                  <Switch
                    checked={settings.offlineMode}
                    onCheckedChange={(checked) => setSettings({...settings, offlineMode: checked})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Export Format</Label>
                  <Select value={settings.exportDataFormat} onValueChange={(value) => setSettings({...settings, exportDataFormat: value})}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
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
            <Button onClick={handleSave} className="h-12 px-8 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
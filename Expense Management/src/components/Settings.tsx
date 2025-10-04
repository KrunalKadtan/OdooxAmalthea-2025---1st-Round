import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { useCountriesAndCurrencies } from '../hooks/useCountriesAndCurrencies';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/custom-select';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  User, 
  Settings as SettingsIcon,
  Save,
  LogOut,
  Crown,
  Users,
  Briefcase,
  DollarSign,
  Globe,
  Bell,
  MapPin,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { toast } from 'sonner';

interface SettingsProps {
  onBack: () => void;
}

// Static language and timezone data (these don't change frequently)
const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' }
];

const timezones = [
  { code: 'UTC', name: 'UTC (Coordinated Universal Time)', offset: '+00:00' },
  { code: 'EST', name: 'EST (Eastern Standard Time)', offset: '-05:00' },
  { code: 'PST', name: 'PST (Pacific Standard Time)', offset: '-08:00' },
  { code: 'GMT', name: 'GMT (Greenwich Mean Time)', offset: '+00:00' },
  { code: 'CET', name: 'CET (Central European Time)', offset: '+01:00' },
  { code: 'JST', name: 'JST (Japan Standard Time)', offset: '+09:00' },
  { code: 'IST', name: 'IST (India Standard Time)', offset: '+05:30' },
  { code: 'CST', name: 'CST (China Standard Time)', offset: '+08:00' },
  { code: 'AEST', name: 'AEST (Australian Eastern Time)', offset: '+10:00' },
  { code: 'MST', name: 'MST (Mountain Standard Time)', offset: '-07:00' }
];



export default function Settings({ onBack }: SettingsProps) {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  // API data hook
  const { 
    countries, 
    currencies, 
    exchangeRates, 
    loading: apiLoading, 
    error: apiError,
    formatCurrencyWithRate,
    convertCurrency
  } = useCountriesAndCurrencies();
  
  const [settings, setSettings] = useState({
    // Personal Information
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    country: 'US',
    
    // Essential Settings
    preferredCurrency: 'USD',
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    
    // Theme & Display
    theme: theme,
    compactView: false,
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    
    // Role-specific (simplified)
    defaultExpenseCategory: user?.role === 'employee' ? 'meals' : '',
    autoApprovalLimit: user?.role === 'manager' ? 500 : 0,
    organizationName: user?.role === 'admin' ? 'Acme Corporation' : ''
  });

  // Currency conversion preview
  const [conversionAmount, setConversionAmount] = useState(100);
  const [showConversion, setShowConversion] = useState(false);

  // Load saved settings on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem(`user_settings_${user?.id}`);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading saved settings:', error);
      }
    }
  }, [user?.id]);

  const handleSave = () => {
    // Save settings to localStorage
    localStorage.setItem(`user_settings_${user?.id}`, JSON.stringify(settings));
    toast.success('Settings saved successfully!');
  };

  const handleReset = () => {
    const defaultSettings = {
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: '',
      country: 'US',
      preferredCurrency: 'USD',
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      theme: 'system',
      compactView: false,
      emailNotifications: true,
      pushNotifications: true,
      defaultExpenseCategory: user?.role === 'employee' ? 'meals' : '',
      autoApprovalLimit: user?.role === 'manager' ? 500 : 0,
      organizationName: user?.role === 'admin' ? 'Acme Corporation' : ''
    };
    setSettings(defaultSettings);
    toast.info('Settings reset to defaults');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'admin':
        return <Crown className="w-5 h-5 text-red-500" />;
      case 'manager':
        return <Users className="w-5 h-5 text-blue-500" />;
      case 'employee':
      default:
        return <Briefcase className="w-5 h-5 text-green-500" />;
    }
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case 'admin':
        return 'from-red-600 to-orange-600';
      case 'manager':
        return 'from-blue-600 to-purple-600';
      case 'employee':
      default:
        return 'from-green-600 to-blue-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/50 via-white to-gray-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="mr-2">
                ← Back
              </Button>
              <div className={`w-10 h-10 bg-gradient-to-br ${getRoleColor()} rounded-xl flex items-center justify-center`}>
                <SettingsIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-bold bg-gradient-to-r ${getRoleColor()} bg-clip-text text-transparent`}>
                  Settings
                </h1>
                <p className="text-sm text-muted-foreground">Manage your preferences</p>
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
              <User className="h-5 w-5 text-gray-500" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback className={`bg-gradient-to-br ${getRoleColor()} text-white font-bold text-2xl`}>
                  {getInitials(settings.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{settings.fullName}</h3>
                <p className="text-muted-foreground">{settings.email}</p>
                <Badge className="mt-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  {getRoleIcon()}
                  <span className="ml-1 capitalize">{user?.role || 'Employee'}</span>
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
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  Country
                </Label>
                <Select value={settings.country} onValueChange={(value) => setSettings({...settings, country: value})}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {apiLoading ? (
                      <SelectItem value="loading" disabled>
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Loading countries...</span>
                        </div>
                      </SelectItem>
                    ) : countries.length > 0 ? (
                      countries.map((country) => (
                        <SelectItem key={country.countryCode} value={country.countryCode}>
                          <div className="flex items-center gap-2">
                            <span>{country.flag}</span>
                            <span>{country.countryName}</span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="US">
                        <div className="flex items-center gap-2">
                          <span>🇺🇸</span>
                          <span>United States (fallback)</span>
                        </div>
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Currency & Localization */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Globe className="h-5 w-5 text-green-500" />
              Currency & Localization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    {apiLoading ? (
                      <SelectItem value="loading" disabled>
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Loading currencies...</span>
                        </div>
                      </SelectItem>
                    ) : currencies.length > 0 ? (
                      currencies.map((currency) => (
                        <SelectItem key={currency.currencyCode} value={currency.currencyCode}>
                          <div className="flex items-center justify-between w-full">
                            <span>{currency.currencySymbol} {currency.currencyName}</span>
                            <span className="text-xs text-muted-foreground ml-2">{currency.countryName}</span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="USD">
                        <div className="flex items-center justify-between w-full">
                          <span>$ US Dollar</span>
                          <span className="text-xs text-muted-foreground ml-2">United States (fallback)</span>
                        </div>
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={settings.language} onValueChange={(value) => setSettings({...settings, language: value})}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <div className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select value={settings.timezone} onValueChange={(value) => setSettings({...settings, timezone: value})}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz.code} value={tz.code}>
                        <div className="flex items-center justify-between w-full">
                          <span>{tz.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">{tz.offset}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date Format</Label>
                <Select value={settings.dateFormat} onValueChange={(value) => setSettings({...settings, dateFormat: value})}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (US)</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (EU)</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (ISO)</SelectItem>
                    <SelectItem value="DD MMM YYYY">DD MMM YYYY</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Currency Conversion Preview */}
            {!apiLoading && currencies.length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-base font-semibold">Currency Conversion Preview</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConversion(!showConversion)}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {showConversion ? 'Hide' : 'Show'} Rates
                  </Button>
                </div>
                
                {showConversion && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Input
                        type="number"
                        value={conversionAmount}
                        onChange={(e) => setConversionAmount(Number(e.target.value))}
                        className="w-32"
                        min="0"
                        step="0.01"
                      />
                      <span className="text-sm text-muted-foreground">
                        {currencies.find(c => c.currencyCode === settings.preferredCurrency)?.currencySymbol || settings.preferredCurrency}
                      </span>
                      <span className="text-sm text-muted-foreground">=</span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                      {['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'].map(targetCurrency => {
                        if (targetCurrency === settings.preferredCurrency) return null;
                        const converted = convertCurrency(conversionAmount, settings.preferredCurrency, targetCurrency);
                        const targetCurrencyData = currencies.find(c => c.currencyCode === targetCurrency);
                        
                        return (
                          <div key={targetCurrency} className="flex justify-between p-2 bg-white dark:bg-gray-700 rounded">
                            <span>{targetCurrency}</span>
                            <span className="font-medium">
                              {converted !== null 
                                ? `${targetCurrencyData?.currencySymbol || targetCurrency}${converted.toFixed(2)}`
                                : 'N/A'
                              }
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    
                    {Object.keys(exchangeRates).length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Exchange rates updated: {new Date().toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* API Error Display */}
            {apiError && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">
                  ⚠️ Unable to load live currency data: {apiError}
                </p>
                <p className="text-xs text-red-500 dark:text-red-500 mt-1">
                  Using fallback data. Some features may be limited.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Bell className="h-5 w-5 text-amber-500" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <p className="text-sm text-muted-foreground">Browser push notifications</p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, pushNotifications: checked})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Role-Specific Settings */}
        {user?.role === 'employee' && (
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Briefcase className="h-5 w-5 text-green-500" />
                Expense Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
            </CardContent>
          </Card>
        )}

        {user?.role === 'manager' && (
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Users className="h-5 w-5 text-blue-500" />
                Manager Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Auto-Approval Limit</Label>
                <Select value={settings.autoApprovalLimit.toString()} onValueChange={(value) => setSettings({...settings, autoApprovalLimit: parseInt(value)})}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">$100</SelectItem>
                    <SelectItem value="250">$250</SelectItem>
                    <SelectItem value="500">$500</SelectItem>
                    <SelectItem value="1000">$1,000</SelectItem>
                    <SelectItem value="2000">$2,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {user?.role === 'admin' && (
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Crown className="h-5 w-5 text-red-500" />
                Admin Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Organization Name</Label>
                <Input
                  value={settings.organizationName}
                  onChange={(e) => setSettings({...settings, organizationName: e.target.value})}
                  className="h-12"
                  placeholder="Enter organization name"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Button variant="outline" onClick={handleReset} className="h-12 px-8">
            Reset to Defaults
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack} className="h-12 px-8">
              Cancel
            </Button>
            <Button onClick={handleSave} className={`h-12 px-8 bg-gradient-to-r ${getRoleColor()} hover:opacity-90 text-white`}>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
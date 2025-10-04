import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Slider } from './ui/slider';
import { 
  Palette, 
  Bell, 
  DollarSign,
  Languages,
  Clock,
  Eye,
  Download,
  Smartphone,
  Volume2,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { useTheme } from './ThemeContext';

interface SharedSettingsProps {
  settings: any;
  onSettingsChange: (newSettings: any) => void;
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

const timezones = [
  { code: 'UTC', name: 'UTC (Coordinated Universal Time)' },
  { code: 'EST', name: 'EST (Eastern Standard Time)' },
  { code: 'PST', name: 'PST (Pacific Standard Time)' },
  { code: 'GMT', name: 'GMT (Greenwich Mean Time)' },
  { code: 'CET', name: 'CET (Central European Time)' },
  { code: 'JST', name: 'JST (Japan Standard Time)' },
  { code: 'IST', name: 'IST (India Standard Time)' },
  { code: 'AEST', name: 'AEST (Australian Eastern Standard Time)' }
];

export default function SharedSettings({ settings, onSettingsChange }: SharedSettingsProps) {
  const { theme, setTheme } = useTheme();

  const updateSetting = (key: string, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-8">
      {/* Theme & Appearance */}
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Palette className="h-5 w-5 text-pink-500" />
            Theme & Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Theme Mode</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Light Mode
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Dark Mode
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      System Default
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Color Scheme</Label>
              <Select value={settings.colorScheme || 'default'} onValueChange={(value) => updateSetting('colorScheme', value)}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                  <SelectItem value="orange">Orange</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Compact View</Label>
                <p className="text-sm text-muted-foreground">Use compact layout for better space utilization</p>
              </div>
              <Switch
                checked={settings.compactView || false}
                onCheckedChange={(checked) => updateSetting('compactView', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Animations</Label>
                <p className="text-sm text-muted-foreground">Enable smooth animations and transitions</p>
              </div>
              <Switch
                checked={settings.enableAnimations !== false}
                onCheckedChange={(checked) => updateSetting('enableAnimations', checked)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Font Size</Label>
            <div className="px-3">
              <Slider
                value={[settings.fontSize || 14]}
                onValueChange={(value) => updateSetting('fontSize', value[0])}
                max={20}
                min={12}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>Small (12px)</span>
                <span className="font-semibold text-pink-600">{settings.fontSize || 14}px</span>
                <span>Large (20px)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Localization */}
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Globe className="h-5 w-5 text-blue-500" />
            Localization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                Preferred Currency
              </Label>
              <Select value={settings.preferredCurrency || 'USD'} onValueChange={(value) => updateSetting('preferredCurrency', value)}>
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
              <Select value={settings.language || 'en'} onValueChange={(value) => updateSetting('language', value)}>
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
              <Select value={settings.timezone || 'UTC'} onValueChange={(value) => updateSetting('timezone', value)}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.code} value={tz.code}>
                      {tz.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Date Format</Label>
              <Select value={settings.dateFormat || 'MM/DD/YYYY'} onValueChange={(value) => updateSetting('dateFormat', value)}>
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

            <div className="space-y-2">
              <Label>Number Format</Label>
              <Select value={settings.numberFormat || 'US'} onValueChange={(value) => updateSetting('numberFormat', value)}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">1,234.56 (US)</SelectItem>
                  <SelectItem value="EU">1.234,56 (EU)</SelectItem>
                  <SelectItem value="IN">1,23,456.78 (Indian)</SelectItem>
                  <SelectItem value="CH">1'234.56 (Swiss)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
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
                    checked={settings.emailNotifications !== false}
                    onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Browser and mobile push notifications</p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications !== false}
                    onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sound Notifications</Label>
                    <p className="text-sm text-muted-foreground">Play sound for important notifications</p>
                  </div>
                  <Switch
                    checked={settings.soundNotifications || false}
                    onCheckedChange={(checked) => updateSetting('soundNotifications', checked)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-base">Notification Timing</h4>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Quiet Hours Start</Label>
                  <Select value={settings.quietHoursStart || '22:00'} onValueChange={(value) => updateSetting('quietHoursStart', value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20:00">8:00 PM</SelectItem>
                      <SelectItem value="21:00">9:00 PM</SelectItem>
                      <SelectItem value="22:00">10:00 PM</SelectItem>
                      <SelectItem value="23:00">11:00 PM</SelectItem>
                      <SelectItem value="00:00">12:00 AM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Quiet Hours End</Label>
                  <Select value={settings.quietHoursEnd || '08:00'} onValueChange={(value) => updateSetting('quietHoursEnd', value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="06:00">6:00 AM</SelectItem>
                      <SelectItem value="07:00">7:00 AM</SelectItem>
                      <SelectItem value="08:00">8:00 AM</SelectItem>
                      <SelectItem value="09:00">9:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-base font-semibold">Notification Frequency</Label>
            <p className="text-sm text-muted-foreground">How often should we send digest notifications?</p>
            <div className="px-3">
              <Slider
                value={[settings.notificationFrequency || 2]}
                onValueChange={(value) => updateSetting('notificationFrequency', value[0])}
                max={4}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>Immediate</span>
                <span className="font-semibold text-amber-600">
                  {settings.notificationFrequency === 1 && 'Immediate'}
                  {settings.notificationFrequency === 2 && 'Hourly'}
                  {settings.notificationFrequency === 3 && 'Daily'}
                  {settings.notificationFrequency === 4 && 'Weekly'}
                  {!settings.notificationFrequency && 'Hourly'}
                </span>
                <span>Weekly</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility */}
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Eye className="h-5 w-5 text-indigo-500" />
            Accessibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>High Contrast Mode</Label>
                  <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                </div>
                <Switch
                  checked={settings.highContrast || false}
                  onCheckedChange={(checked) => updateSetting('highContrast', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Reduce Motion</Label>
                  <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
                </div>
                <Switch
                  checked={settings.reduceMotion || false}
                  onCheckedChange={(checked) => updateSetting('reduceMotion', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Screen Reader Support</Label>
                  <p className="text-sm text-muted-foreground">Enhanced screen reader compatibility</p>
                </div>
                <Switch
                  checked={settings.screenReaderSupport !== false}
                  onCheckedChange={(checked) => updateSetting('screenReaderSupport', checked)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Keyboard Navigation</Label>
                  <p className="text-sm text-muted-foreground">Enhanced keyboard shortcuts</p>
                </div>
                <Switch
                  checked={settings.keyboardNavigation !== false}
                  onCheckedChange={(checked) => updateSetting('keyboardNavigation', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Focus Indicators</Label>
                  <p className="text-sm text-muted-foreground">Visible focus indicators</p>
                </div>
                <Switch
                  checked={settings.focusIndicators !== false}
                  onCheckedChange={(checked) => updateSetting('focusIndicators', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Text Size Multiplier</Label>
                <Select value={(settings.textSizeMultiplier || 1).toString()} onValueChange={(value) => updateSetting('textSizeMultiplier', parseFloat(value))}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.8">Small (80%)</SelectItem>
                    <SelectItem value="1">Normal (100%)</SelectItem>
                    <SelectItem value="1.2">Large (120%)</SelectItem>
                    <SelectItem value="1.5">Extra Large (150%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Download className="h-5 w-5 text-green-500" />
            Data & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Analytics Tracking</Label>
                  <p className="text-sm text-muted-foreground">Help improve the app with usage data</p>
                </div>
                <Switch
                  checked={settings.analyticsTracking !== false}
                  onCheckedChange={(checked) => updateSetting('analyticsTracking', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Crash Reporting</Label>
                  <p className="text-sm text-muted-foreground">Send crash reports to help fix issues</p>
                </div>
                <Switch
                  checked={settings.crashReporting !== false}
                  onCheckedChange={(checked) => updateSetting('crashReporting', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Performance Monitoring</Label>
                  <p className="text-sm text-muted-foreground">Monitor app performance</p>
                </div>
                <Switch
                  checked={settings.performanceMonitoring !== false}
                  onCheckedChange={(checked) => updateSetting('performanceMonitoring', checked)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Data Export Format</Label>
                <Select value={settings.exportFormat || 'pdf'} onValueChange={(value) => updateSetting('exportFormat', value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-save Drafts</Label>
                  <p className="text-sm text-muted-foreground">Automatically save work in progress</p>
                </div>
                <Switch
                  checked={settings.autoSaveDrafts !== false}
                  onCheckedChange={(checked) => updateSetting('autoSaveDrafts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Offline Mode</Label>
                  <p className="text-sm text-muted-foreground">Allow offline functionality</p>
                </div>
                <Switch
                  checked={settings.offlineMode !== false}
                  onCheckedChange={(checked) => updateSetting('offlineMode', checked)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
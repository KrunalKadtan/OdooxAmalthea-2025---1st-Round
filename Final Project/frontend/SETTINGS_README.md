# 🎛️ Settings System Documentation

## Overview
A comprehensive, role-based settings system for the expense management application with support for Employee, Manager, and Admin roles.

## 🏗️ Architecture

### Core Components
- **Settings.tsx** - Main unified settings component with tabbed interface
- **SettingsRouter.tsx** - Routes to appropriate settings based on user role
- **SharedSettings.tsx** - Common settings shared across all roles
- **EmployeeSettings.tsx** - Employee-specific settings
- **ManagerSettings.tsx** - Manager-specific settings  
- **AdminSettings.tsx** - Admin-specific settings

### State Management
- **useSettings.ts** - Custom hook for settings state management
- **SettingsContext.tsx** - React Context provider for global settings access
- **utils/settings.ts** - Utility functions for formatting, validation, etc.

## 🚀 Quick Start

### 1. Basic Integration
```tsx
import { SettingsProvider } from './components/SettingsContext';
import Settings from './components/Settings';

function App() {
  return (
    <SettingsProvider>
      <Settings onBack={() => navigate('/dashboard')} />
    </SettingsProvider>
  );
}
```

### 2. Using Settings in Components
```tsx
import { useSettingsContext, useSetting } from './components/SettingsContext';

function MyComponent() {
  const { settings, updateSetting } = useSettingsContext();
  const currency = useSetting<string>('preferredCurrency');
  
  return (
    <div>
      <p>Currency: {currency}</p>
      <button onClick={() => updateSetting('preferredCurrency', 'EUR')}>
        Switch to EUR
      </button>
    </div>
  );
}
```

### 3. Role-Based Settings
```tsx
import { SettingsRouter } from './components/SettingsRouter';

// Automatically shows appropriate settings based on user role
<SettingsRouter onBack={() => navigate('/dashboard')} />
```

## 📋 Features by Role

### 👤 Employee Settings
- **Personal Profile** - Name, email, phone, department
- **Expense Preferences** - Default categories, payment methods, reminders
- **Receipt Settings** - Auto-capture, OCR, quality settings
- **Notifications** - Email, push, status updates
- **Privacy & Security** - Location tracking, biometric auth
- **Accessibility** - High contrast, font size, screen reader support

### 👥 Manager Settings
- **Team Management** - Visibility controls, delegation settings
- **Approval Workflow** - Auto-approval limits, timeout settings
- **Budget Controls** - Spending limits, receipt requirements
- **Dashboard Preferences** - Default views, team statistics
- **Reporting** - Team reports, analytics, notifications
- **Bulk Operations** - Bulk approval, comment requirements

### 👑 Admin Settings
- **Organization Config** - Company details, fiscal year, branding
- **User Management** - Registration, authentication, security policies
- **System Security** - Compliance modes, audit logging, encryption
- **Expense Policies** - Global limits, categories, approval workflows
- **Performance** - Caching, compression, backup settings
- **Feature Flags** - Beta features, AI capabilities, advanced workflows

## 🎨 Shared Settings (All Roles)

### Theme & Appearance
- **Theme Mode** - Light, dark, system default
- **Color Schemes** - Multiple color options
- **Typography** - Font size, text scaling
- **Layout** - Compact view, animations

### Localization
- **Currency** - 7+ supported currencies with proper formatting
- **Language** - 8+ supported languages
- **Timezone** - Global timezone support
- **Formats** - Date and number formatting preferences

### Notifications
- **Channels** - Email, push, sound notifications
- **Timing** - Quiet hours, frequency controls
- **Types** - Status updates, reminders, reports

### Accessibility
- **Visual** - High contrast, reduced motion
- **Navigation** - Keyboard shortcuts, focus indicators
- **Screen Readers** - Enhanced compatibility
- **Text** - Size multipliers, readable fonts

### Privacy & Data
- **Tracking** - Analytics, crash reporting
- **Export** - Multiple format support (PDF, Excel, CSV)
- **Storage** - Auto-save, offline mode

## 🛠️ Advanced Features

### Settings Persistence
```tsx
const { saveSettings, hasUnsavedChanges } = useSettingsContext();

// Auto-save to localStorage
await saveSettings();

// Check for unsaved changes
if (hasUnsavedChanges) {
  // Show warning before navigation
}
```

### Settings Import/Export
```tsx
const { exportSettings, importSettings } = useSettingsContext();

// Export settings to file
exportSettings(); // Downloads JSON file

// Import settings from file
const result = importSettings(jsonString);
if (result.success) {
  toast.success('Settings imported successfully');
}
```

### Settings Validation
```tsx
import { validateSettings } from './utils/settings';

const { isValid, errors } = validateSettings(userSettings);
if (!isValid) {
  console.log('Validation errors:', errors);
}
```

### Utility Functions
```tsx
import { 
  formatCurrency, 
  formatDate, 
  isQuietHours,
  sendNotification 
} from './utils/settings';

// Format currency based on user settings
const formatted = formatCurrency(123.45, 'USD', 'en-US'); // $123.45

// Check if in quiet hours
if (!isQuietHours('22:00', '08:00')) {
  await sendNotification('New expense submitted', {}, settings);
}
```

## 🎯 TypeScript Support

### Settings Types
```tsx
import { 
  SettingsConfig,
  EmployeeSettingsConfig,
  ManagerSettingsConfig,
  AdminSettingsConfig 
} from './components/settings';

// Type-safe settings access
const settings: EmployeeSettingsConfig = {
  defaultExpenseCategory: 'meals',
  autoReceiptCapture: true,
  // ... other settings
};
```

### Custom Hooks
```tsx
// Get specific setting with type safety
const currency = useSetting<string>('preferredCurrency');
const fontSize = useSetting<number>('fontSize');

// Check feature flags
const hasAIFeatures = useFeatureFlag('aiFeatures');
```

## 🎨 Styling & Theming

### CSS Variables
The settings system automatically applies CSS variables for:
- `--base-font-size` - User's preferred font size
- `--text-scale` - Text size multiplier
- Theme classes: `high-contrast`, `reduce-motion`, `enhanced-focus`

### Responsive Design
All settings pages are fully responsive with:
- Mobile-first design
- Touch-friendly controls
- Adaptive layouts
- Accessible navigation

## 🔧 Configuration

### Default Settings
Customize default settings in `hooks/useSettings.ts`:
```tsx
const getDefaultSettings = (role: string): SettingsConfig => {
  // Customize defaults per role
  return {
    preferredCurrency: 'USD',
    language: 'en',
    // ... other defaults
  };
};
```

### Feature Flags
Enable/disable features in admin settings:
```tsx
const settings = {
  aiFeatures: true,
  betaFeatures: false,
  advancedWorkflows: true
};
```

## 🚨 Error Handling

### Validation
- Email format validation
- Currency code validation
- Range validation for numeric settings
- Required field validation

### Fallbacks
- Graceful degradation for missing settings
- Default values for all settings
- Error boundaries for component failures

## 📱 Mobile Support

### Touch Interactions
- Touch-friendly sliders and switches
- Swipe gestures for navigation
- Responsive touch targets

### Offline Support
- Settings cached in localStorage
- Offline mode for critical settings
- Sync when connection restored

## 🔒 Security & Privacy

### Data Protection
- Settings stored locally by default
- No sensitive data in settings
- GDPR compliance options

### Access Control
- Role-based setting visibility
- Permission checks for sensitive settings
- Audit logging for admin changes

## 🧪 Testing

### Unit Tests
```tsx
import { validateSettings } from './utils/settings';

test('validates email format', () => {
  const result = validateSettings({ email: 'invalid-email' });
  expect(result.isValid).toBe(false);
  expect(result.errors).toContain('Invalid email format');
});
```

### Integration Tests
```tsx
import { render, screen } from '@testing-library/react';
import { SettingsProvider } from './SettingsContext';
import Settings from './Settings';

test('renders settings for employee role', () => {
  render(
    <SettingsProvider>
      <Settings onBack={() => {}} />
    </SettingsProvider>
  );
  
  expect(screen.getByText('Employee Settings')).toBeInTheDocument();
});
```

## 📈 Performance

### Optimizations
- Lazy loading of settings components
- Debounced auto-save
- Memoized calculations
- Efficient re-renders

### Bundle Size
- Tree-shakeable utilities
- Conditional imports
- Optimized dependencies

## 🔄 Migration

### Upgrading Settings
```tsx
// Handle settings migration between versions
const migrateSettings = (oldSettings: any): SettingsConfig => {
  return {
    ...getDefaultSettings('employee'),
    ...oldSettings,
    // Add new fields with defaults
    newFeature: true
  };
};
```

## 🤝 Contributing

### Adding New Settings
1. Add to `SettingsConfig` interface
2. Update default values in `useSettings.ts`
3. Add UI components in appropriate settings file
4. Update validation in `utils/settings.ts`
5. Add tests for new functionality

### Code Style
- Use TypeScript for type safety
- Follow existing naming conventions
- Add JSDoc comments for complex functions
- Maintain responsive design patterns

## 📚 Examples

See `SettingsExample.tsx` for a complete integration example.

## 🐛 Troubleshooting

### Common Issues
1. **Settings not persisting** - Check localStorage permissions
2. **Type errors** - Ensure proper TypeScript configuration
3. **Styling issues** - Verify Tailwind CSS setup
4. **Component not rendering** - Check role-based routing logic

### Debug Mode
Enable debug logging:
```tsx
localStorage.setItem('settings-debug', 'true');
```

## 📄 License
This settings system is part of the expense management application and follows the same license terms.
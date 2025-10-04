import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../components/AuthContext';
import { SettingsConfig, EmployeeSettingsConfig, ManagerSettingsConfig, AdminSettingsConfig } from '../components/settings/index';

// Default settings for each role
const getDefaultSettings = (role: string): SettingsConfig => {
  const baseSettings: SettingsConfig = {
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    department: '',
    employeeId: '',
    
    // Localization
    preferredCurrency: 'USD',
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: 'US',
    
    // Appearance
    colorScheme: 'default',
    compactView: false,
    enableAnimations: true,
    fontSize: 14,
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    soundNotifications: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    notificationFrequency: 2,
    
    // Accessibility
    highContrast: false,
    reduceMotion: false,
    screenReaderSupport: true,
    keyboardNavigation: true,
    focusIndicators: true,
    textSizeMultiplier: 1,
    
    // Privacy & Data
    analyticsTracking: true,
    crashReporting: true,
    performanceMonitoring: true,
    exportFormat: 'pdf',
    autoSaveDrafts: true,
    offlineMode: true
  };

  switch (role) {
    case 'employee':
      return {
        ...baseSettings,
        // Employee-specific settings
        defaultExpenseCategory: 'meals',
        autoReceiptCapture: true,
        expenseReminderDays: [3],
        defaultPaymentMethod: 'company-card',
        requireReceiptReminder: true,
        autoUploadReceipts: true,
        receiptQuality: 'high',
        cropReceiptsAutomatically: true,
        ocrEnabled: true,
        includeInTeamReports: true,
        shareSpendingInsights: false
      } as EmployeeSettingsConfig;

    case 'manager':
      return {
        ...baseSettings,
        // Manager-specific settings
        autoApprovalLimit: [500],
        requireReceiptsAbove: [100],
        approvalTimeoutDays: 7,
        teamVisibility: 'full',
        allowTeamExpenseView: true,
        requireApprovalComments: false,
        enableBulkApproval: true,
        allowDelegation: true,
        delegateApprovals: false,
        pendingExpenseAlerts: true,
        escalationNotifications: true,
        budgetAlerts: true,
        teamExpenseDigest: true,
        weeklyTeamReports: true,
        monthlyReports: true,
        defaultDashboardView: 'pending',
        showTeamStats: true,
        showBudgetProgress: true,
        requireSecondApproval: false,
        secondApprovalLimit: [1000],
        expenseAnalytics: true,
        teamPerformanceReports: false,
        budgetVarianceReports: true
      } as ManagerSettingsConfig;

    case 'admin':
      return {
        ...baseSettings,
        // Admin-specific settings
        organizationName: 'Acme Corporation',
        organizationDomain: 'acme.com',
        organizationAddress: '',
        taxId: '',
        fiscalYearStart: 'january',
        defaultCurrency: 'USD',
        defaultLanguage: 'en',
        defaultTimezone: 'UTC',
        allowSelfRegistration: false,
        requireEmailVerification: true,
        passwordComplexity: 'medium',
        sessionTimeout: [30],
        maxLoginAttempts: 5,
        enableTwoFactor: true,
        globalExpenseLimit: [5000],
        expenseCategories: 'default',
        allowPersonalExpenses: false,
        requireManagerApproval: true,
        requireFinanceApproval: true,
        financeApprovalLimit: [1000],
        escalationTimeoutDays: 7,
        enableApiAccess: true,
        webhookNotifications: false,
        ssoEnabled: false,
        ldapIntegration: false,
        systemNotifications: true,
        maintenanceNotifications: true,
        securityAlerts: true,
        emailServerConfig: 'default',
        smsNotifications: false,
        dataRetentionPeriod: 7,
        enableAuditLogging: true,
        allowDataExport: true,
        gdprCompliance: true,
        encryptionEnabled: true,
        enableAdvancedReporting: true,
        realTimeAnalytics: true,
        customDashboards: true,
        dataVisualization: true,
        exportFormats: ['pdf', 'excel', 'csv'],
        enableCaching: true,
        compressionEnabled: true,
        cdnEnabled: false,
        backupFrequency: 'daily',
        allowMobileAccess: true,
        mobileAppBranding: true,
        offlineModeEnabled: true,
        pushNotificationsEnabled: true,
        complianceMode: 'standard',
        securityLevel: 'high',
        ipWhitelisting: false,
        deviceManagement: false,
        betaFeatures: false,
        experimentalFeatures: false,
        aiFeatures: true,
        advancedWorkflows: true
      } as AdminSettingsConfig;

    default:
      return baseSettings;
  }
};

export const useSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SettingsConfig>(() => 
    getDefaultSettings(user?.role || 'employee')
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load settings from localStorage or API
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        // Try to load from localStorage first
        const savedSettings = localStorage.getItem(`settings_${user?.id}`);
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings({
            ...getDefaultSettings(user?.role || 'employee'),
            ...parsedSettings,
            fullName: user?.fullName || '',
            email: user?.email || ''
          });
        } else {
          // Initialize with default settings
          const defaultSettings = getDefaultSettings(user?.role || 'employee');
          setSettings({
            ...defaultSettings,
            fullName: user?.fullName || '',
            email: user?.email || ''
          });
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
        // Fallback to default settings
        const defaultSettings = getDefaultSettings(user?.role || 'employee');
        setSettings({
          ...defaultSettings,
          fullName: user?.fullName || '',
          email: user?.email || ''
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadSettings();
    }
  }, [user]);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<SettingsConfig>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    setHasUnsavedChanges(true);
  }, []);

  // Save settings
  const saveSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      // Save to localStorage (in a real app, this would be an API call)
      localStorage.setItem(`settings_${user?.id}`, JSON.stringify(settings));
      setHasUnsavedChanges(false);
      return { success: true };
    } catch (error) {
      console.error('Failed to save settings:', error);
      return { success: false, error: 'Failed to save settings' };
    } finally {
      setIsLoading(false);
    }
  }, [settings, user?.id]);

  // Reset settings to defaults
  const resetSettings = useCallback(() => {
    const defaultSettings = getDefaultSettings(user?.role || 'employee');
    setSettings({
      ...defaultSettings,
      fullName: user?.fullName || '',
      email: user?.email || ''
    });
    setHasUnsavedChanges(true);
  }, [user]);

  // Get setting by key
  const getSetting = useCallback((key: keyof SettingsConfig) => {
    return settings[key];
  }, [settings]);

  // Update single setting
  const updateSetting = useCallback((key: keyof SettingsConfig, value: any) => {
    updateSettings({ [key]: value });
  }, [updateSettings]);

  // Export settings
  const exportSettings = useCallback(() => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `settings_${user?.email}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [settings, user?.email]);

  // Import settings
  const importSettings = useCallback((settingsData: string) => {
    try {
      const parsedSettings = JSON.parse(settingsData);
      const defaultSettings = getDefaultSettings(user?.role || 'employee');
      
      // Merge with defaults to ensure all required fields are present
      const mergedSettings = {
        ...defaultSettings,
        ...parsedSettings,
        fullName: user?.fullName || '',
        email: user?.email || ''
      };
      
      setSettings(mergedSettings);
      setHasUnsavedChanges(true);
      return { success: true };
    } catch (error) {
      console.error('Failed to import settings:', error);
      return { success: false, error: 'Invalid settings file' };
    }
  }, [user]);

  return {
    settings,
    isLoading,
    hasUnsavedChanges,
    updateSettings,
    updateSetting,
    saveSettings,
    resetSettings,
    getSetting,
    exportSettings,
    importSettings
  };
};
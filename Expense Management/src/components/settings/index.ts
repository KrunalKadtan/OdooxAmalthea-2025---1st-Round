// Main Settings Components
export { default as Settings } from '../Settings';
export { default as SettingsRouter } from '../SettingsRouter';
export { default as SharedSettings } from '../SharedSettings';

// Role-specific Settings
export { default as EmployeeSettings } from '../EmployeeSettings';
export { default as ManagerSettings } from '../ManagerSettings';
export { default as AdminSettings } from '../AdminSettings';

// Settings Types
export interface SettingsConfig {
  // Personal Information
  fullName: string;
  email: string;
  phone?: string;
  department?: string;
  employeeId?: string;
  
  // Localization
  preferredCurrency: string;
  language: string;
  timezone: string;
  dateFormat: string;
  numberFormat: string;
  
  // Appearance
  colorScheme: string;
  compactView: boolean;
  enableAnimations: boolean;
  fontSize: number;
  
  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  soundNotifications: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  notificationFrequency: number;
  
  // Accessibility
  highContrast: boolean;
  reduceMotion: boolean;
  screenReaderSupport: boolean;
  keyboardNavigation: boolean;
  focusIndicators: boolean;
  textSizeMultiplier: number;
  
  // Privacy & Data
  analyticsTracking: boolean;
  crashReporting: boolean;
  performanceMonitoring: boolean;
  exportFormat: string;
  autoSaveDrafts: boolean;
  offlineMode: boolean;
  
  // Role-specific settings
  [key: string]: any;
}

export interface EmployeeSettingsConfig extends SettingsConfig {
  defaultExpenseCategory: string;
  autoReceiptCapture: boolean;
  expenseReminderDays: number[];
  defaultPaymentMethod: string;
  requireReceiptReminder: boolean;
  autoUploadReceipts: boolean;
  receiptQuality: string;
  cropReceiptsAutomatically: boolean;
  ocrEnabled: boolean;
}

export interface ManagerSettingsConfig extends SettingsConfig {
  autoApprovalLimit: number[];
  requireReceiptsAbove: number[];
  approvalTimeoutDays: number;
  teamVisibility: string;
  allowTeamExpenseView: boolean;
  requireApprovalComments: boolean;
  enableBulkApproval: boolean;
  allowDelegation: boolean;
  delegateApprovals: boolean;
  pendingExpenseAlerts: boolean;
  escalationNotifications: boolean;
  budgetAlerts: boolean;
  teamExpenseDigest: boolean;
  weeklyTeamReports: boolean;
  monthlyReports: boolean;
  defaultDashboardView: string;
  showTeamStats: boolean;
  showBudgetProgress: boolean;
}

export interface AdminSettingsConfig extends SettingsConfig {
  organizationName: string;
  organizationDomain: string;
  organizationAddress: string;
  taxId: string;
  fiscalYearStart: string;
  defaultCurrency: string;
  defaultLanguage: string;
  defaultTimezone: string;
  allowSelfRegistration: boolean;
  requireEmailVerification: boolean;
  passwordComplexity: string;
  sessionTimeout: number[];
  maxLoginAttempts: number;
  enableTwoFactor: boolean;
  globalExpenseLimit: number[];
  expenseCategories: string;
  allowPersonalExpenses: boolean;
  requireManagerApproval: boolean;
  requireFinanceApproval: boolean;
  financeApprovalLimit: number[];
  escalationTimeoutDays: number;
  enableApiAccess: boolean;
  webhookNotifications: boolean;
  ssoEnabled: boolean;
  ldapIntegration: boolean;
  systemNotifications: boolean;
  maintenanceNotifications: boolean;
  securityAlerts: boolean;
  emailServerConfig: string;
  smsNotifications: boolean;
  dataRetentionPeriod: number;
  enableAuditLogging: boolean;
  allowDataExport: boolean;
  gdprCompliance: boolean;
  encryptionEnabled: boolean;
  enableAdvancedReporting: boolean;
  realTimeAnalytics: boolean;
  customDashboards: boolean;
  dataVisualization: boolean;
  exportFormats: string[];
  enableCaching: boolean;
  compressionEnabled: boolean;
  cdnEnabled: boolean;
  backupFrequency: string;
  allowMobileAccess: boolean;
  mobileAppBranding: boolean;
  offlineModeEnabled: boolean;
  pushNotificationsEnabled: boolean;
  complianceMode: string;
  securityLevel: string;
  ipWhitelisting: boolean;
  deviceManagement: boolean;
  betaFeatures: boolean;
  experimentalFeatures: boolean;
  aiFeatures: boolean;
  advancedWorkflows: boolean;
}
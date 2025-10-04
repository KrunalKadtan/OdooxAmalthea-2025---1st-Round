import { SettingsConfig } from '../components/settings/index';

// Currency formatting based on user settings
export const formatCurrency = (
  amount: number, 
  currency: string = 'USD', 
  locale: string = 'en-US'
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(amount);
  } catch (error) {
    // Fallback formatting
    const currencySymbols: { [key: string]: string } = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      CAD: 'C$',
      JPY: '¥',
      AUD: 'A$',
      INR: '₹'
    };
    const symbol = currencySymbols[currency] || '$';
    return `${symbol}${amount.toFixed(2)}`;
  }
};

// Date formatting based on user settings
export const formatDate = (
  date: Date | string, 
  format: string = 'MM/DD/YYYY',
  locale: string = 'en-US'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  try {
    switch (format) {
      case 'MM/DD/YYYY':
        return dateObj.toLocaleDateString('en-US');
      case 'DD/MM/YYYY':
        return dateObj.toLocaleDateString('en-GB');
      case 'YYYY-MM-DD':
        return dateObj.toISOString().split('T')[0];
      case 'DD MMM YYYY':
        return dateObj.toLocaleDateString(locale, {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      default:
        return dateObj.toLocaleDateString(locale);
    }
  } catch (error) {
    return dateObj.toLocaleDateString();
  }
};

// Number formatting based on user settings
export const formatNumber = (
  number: number, 
  format: string = 'US'
): string => {
  try {
    switch (format) {
      case 'US':
        return number.toLocaleString('en-US');
      case 'EU':
        return number.toLocaleString('de-DE');
      case 'IN':
        return number.toLocaleString('en-IN');
      case 'CH':
        return number.toLocaleString('de-CH');
      default:
        return number.toLocaleString();
    }
  } catch (error) {
    return number.toString();
  }
};

// Get timezone offset
export const getTimezoneOffset = (timezone: string): number => {
  try {
    const now = new Date();
    const utc = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
    const targetTime = new Date(utc.toLocaleString('en-US', { timeZone: timezone }));
    return (targetTime.getTime() - utc.getTime()) / (1000 * 60 * 60);
  } catch (error) {
    return 0;
  }
};

// Convert time to user's timezone
export const convertToUserTimezone = (
  date: Date | string, 
  timezone: string = 'UTC'
): Date => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  try {
    const timeString = dateObj.toLocaleString('en-US', { timeZone: timezone });
    return new Date(timeString);
  } catch (error) {
    return dateObj;
  }
};

// Check if current time is within quiet hours
export const isQuietHours = (
  quietStart: string = '22:00', 
  quietEnd: string = '08:00'
): boolean => {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const [startHour, startMin] = quietStart.split(':').map(Number);
  const [endHour, endMin] = quietEnd.split(':').map(Number);
  
  const startTime = startHour * 60 + startMin;
  const endTime = endHour * 60 + endMin;
  
  if (startTime <= endTime) {
    // Same day quiet hours (e.g., 22:00 to 23:59)
    return currentTime >= startTime && currentTime <= endTime;
  } else {
    // Overnight quiet hours (e.g., 22:00 to 08:00)
    return currentTime >= startTime || currentTime <= endTime;
  }
};

// Apply accessibility settings to document
export const applyAccessibilitySettings = (settings: SettingsConfig): void => {
  const root = document.documentElement;
  
  // Font size
  if (settings.fontSize) {
    root.style.setProperty('--base-font-size', `${settings.fontSize}px`);
  }
  
  // Text size multiplier
  if (settings.textSizeMultiplier && settings.textSizeMultiplier !== 1) {
    root.style.setProperty('--text-scale', settings.textSizeMultiplier.toString());
  }
  
  // High contrast mode
  if (settings.highContrast) {
    root.classList.add('high-contrast');
  } else {
    root.classList.remove('high-contrast');
  }
  
  // Reduced motion
  if (settings.reduceMotion) {
    root.classList.add('reduce-motion');
  } else {
    root.classList.remove('reduce-motion');
  }
  
  // Focus indicators
  if (settings.focusIndicators) {
    root.classList.add('enhanced-focus');
  } else {
    root.classList.remove('enhanced-focus');
  }
};

// Get notification permission status
export const getNotificationPermission = (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    return Promise.resolve('denied');
  }
  
  if (Notification.permission === 'default') {
    return Notification.requestPermission();
  }
  
  return Promise.resolve(Notification.permission);
};

// Send browser notification (respects user settings)
export const sendNotification = async (
  title: string,
  options: NotificationOptions = {},
  settings: SettingsConfig
): Promise<boolean> => {
  // Check if notifications are enabled
  if (!settings.pushNotifications) {
    return false;
  }
  
  // Check quiet hours
  if (isQuietHours(settings.quietHoursStart, settings.quietHoursEnd)) {
    return false;
  }
  
  // Check permission
  const permission = await getNotificationPermission();
  if (permission !== 'granted') {
    return false;
  }
  
  try {
    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options
    });
    
    // Auto-close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);
    
    return true;
  } catch (error) {
    console.error('Failed to send notification:', error);
    return false;
  }
};

// Validate settings object
export const validateSettings = (settings: Partial<SettingsConfig>): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  // Validate email format
  if (settings.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)) {
    errors.push('Invalid email format');
  }
  
  // Validate currency code
  if (settings.preferredCurrency && !/^[A-Z]{3}$/.test(settings.preferredCurrency)) {
    errors.push('Invalid currency code');
  }
  
  // Validate language code
  if (settings.language && !/^[a-z]{2}$/.test(settings.language)) {
    errors.push('Invalid language code');
  }
  
  // Validate font size range
  if (settings.fontSize && (settings.fontSize < 10 || settings.fontSize > 24)) {
    errors.push('Font size must be between 10 and 24 pixels');
  }
  
  // Validate text size multiplier
  if (settings.textSizeMultiplier && (settings.textSizeMultiplier < 0.5 || settings.textSizeMultiplier > 2)) {
    errors.push('Text size multiplier must be between 0.5 and 2');
  }
  
  // Validate notification frequency
  if (settings.notificationFrequency && (settings.notificationFrequency < 1 || settings.notificationFrequency > 4)) {
    errors.push('Notification frequency must be between 1 and 4');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Merge settings with defaults
export const mergeWithDefaults = (
  userSettings: Partial<SettingsConfig>,
  defaultSettings: SettingsConfig
): SettingsConfig => {
  return {
    ...defaultSettings,
    ...userSettings
  };
};

// Export settings to different formats
export const exportSettingsToFormat = (
  settings: SettingsConfig,
  format: 'json' | 'csv' | 'txt' = 'json'
): string => {
  switch (format) {
    case 'json':
      return JSON.stringify(settings, null, 2);
    
    case 'csv':
      const headers = Object.keys(settings).join(',');
      const values = Object.values(settings).map(v => 
        typeof v === 'string' ? `"${v}"` : v
      ).join(',');
      return `${headers}\n${values}`;
    
    case 'txt':
      return Object.entries(settings)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
    
    default:
      return JSON.stringify(settings, null, 2);
  }
};
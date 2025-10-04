import { SettingsConfig } from '../components/settings/index';

// API Types
export interface CountryData {
  name: {
    common: string;
    official: string;
  };
  currencies: {
    [key: string]: {
      name: string;
      symbol: string;
    };
  };
  cca2: string; // 2-letter country code
  flag: string;
}

export interface CurrencyRate {
  [key: string]: number;
}

export interface ExchangeRateResponse {
  base: string;
  date: string;
  rates: CurrencyRate;
}

// API Functions
export const fetchCountriesAndCurrencies = async (): Promise<CountryData[]> => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,currencies,cca2,flag');
    if (!response.ok) {
      throw new Error('Failed to fetch countries data');
    }
    const data: CountryData[] = await response.json();
    return data.filter(country => country.currencies && Object.keys(country.currencies).length > 0);
  } catch (error) {
    console.error('Error fetching countries and currencies:', error);
    // Return fallback data
    return [];
  }
};

export const fetchExchangeRates = async (baseCurrency: string = 'USD'): Promise<ExchangeRateResponse | null> => {
  try {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }
    const data: ExchangeRateResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return null;
  }
};

export const convertCurrency = async (
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number | null> => {
  try {
    const exchangeData = await fetchExchangeRates(fromCurrency);
    if (!exchangeData || !exchangeData.rates[toCurrency]) {
      return null;
    }
    return amount * exchangeData.rates[toCurrency];
  } catch (error) {
    console.error('Error converting currency:', error);
    return null;
  }
};

// Transform API data to our format
export const transformCountryData = (countries: CountryData[]) => {
  return countries.map(country => {
    const currencyCode = Object.keys(country.currencies)[0];
    const currency = country.currencies[currencyCode];
    
    return {
      countryCode: country.cca2,
      countryName: country.name.common,
      flag: country.flag,
      currencyCode,
      currencyName: currency.name,
      currencySymbol: currency.symbol || currencyCode
    };
  }).sort((a, b) => a.countryName.localeCompare(b.countryName));
};

// Cache for API data
let countriesCache: any[] | null = null;
let exchangeRatesCache: { [key: string]: ExchangeRateResponse } = {};
let cacheTimestamp = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export const getCachedCountriesAndCurrencies = async () => {
  const now = Date.now();
  if (countriesCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return countriesCache;
  }
  
  const countries = await fetchCountriesAndCurrencies();
  const transformedData = transformCountryData(countries);
  
  countriesCache = transformedData;
  cacheTimestamp = now;
  
  return transformedData;
};

export const getCachedExchangeRates = async (baseCurrency: string) => {
  const now = Date.now();
  const cacheKey = `${baseCurrency}_${Math.floor(now / CACHE_DURATION)}`;
  
  if (exchangeRatesCache[cacheKey]) {
    return exchangeRatesCache[cacheKey];
  }
  
  const rates = await fetchExchangeRates(baseCurrency);
  if (rates) {
    exchangeRatesCache[cacheKey] = rates;
    // Clean old cache entries
    Object.keys(exchangeRatesCache).forEach(key => {
      if (!key.includes(Math.floor(now / CACHE_DURATION).toString())) {
        delete exchangeRatesCache[key];
      }
    });
  }
  
  return rates;
};

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
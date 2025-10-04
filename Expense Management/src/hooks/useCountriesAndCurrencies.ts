import { useState, useEffect } from 'react';
import { getCachedCountriesAndCurrencies, getCachedExchangeRates } from '../utils/settings';

export interface CountryCurrency {
  countryCode: string;
  countryName: string;
  flag: string;
  currencyCode: string;
  currencyName: string;
  currencySymbol: string;
}

export interface ExchangeRates {
  [key: string]: number;
}

export const useCountriesAndCurrencies = () => {
  const [countries, setCountries] = useState<CountryCurrency[]>([]);
  const [currencies, setCurrencies] = useState<CountryCurrency[]>([]);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch countries and currencies
        const data = await getCachedCountriesAndCurrencies();
        
        // Set countries (all countries)
        setCountries(data);
        
        // Set currencies (unique currencies only)
        const uniqueCurrencies = data.reduce((acc: CountryCurrency[], current) => {
          const exists = acc.find(item => item.currencyCode === current.currencyCode);
          if (!exists) {
            acc.push(current);
          }
          return acc;
        }, []).sort((a, b) => a.currencyCode.localeCompare(b.currencyCode));
        
        setCurrencies(uniqueCurrencies);

        // Fetch exchange rates for USD (most common base)
        const rates = await getCachedExchangeRates('USD');
        if (rates) {
          setExchangeRates(rates.rates);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('Error loading countries and currencies:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getCountryByCode = (code: string) => {
    return countries.find(country => country.countryCode === code);
  };

  const getCurrencyByCode = (code: string) => {
    return currencies.find(currency => currency.currencyCode === code);
  };

  const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number | null => {
    if (fromCurrency === toCurrency) return amount;
    
    // Convert through USD if needed
    if (fromCurrency === 'USD') {
      const rate = exchangeRates[toCurrency];
      return rate ? amount * rate : null;
    } else if (toCurrency === 'USD') {
      const rate = exchangeRates[fromCurrency];
      return rate ? amount / rate : null;
    } else {
      // Convert from -> USD -> to
      const fromRate = exchangeRates[fromCurrency];
      const toRate = exchangeRates[toCurrency];
      if (fromRate && toRate) {
        const usdAmount = amount / fromRate;
        return usdAmount * toRate;
      }
      return null;
    }
  };

  const formatCurrencyWithRate = (
    amount: number, 
    currency: string, 
    targetCurrency?: string
  ): string => {
    const currencyData = getCurrencyByCode(currency);
    const symbol = currencyData?.currencySymbol || currency;
    
    if (targetCurrency && targetCurrency !== currency) {
      const convertedAmount = convertCurrency(amount, currency, targetCurrency);
      if (convertedAmount !== null) {
        const targetCurrencyData = getCurrencyByCode(targetCurrency);
        const targetSymbol = targetCurrencyData?.currencySymbol || targetCurrency;
        return `${symbol}${amount.toFixed(2)} (≈ ${targetSymbol}${convertedAmount.toFixed(2)})`;
      }
    }
    
    return `${symbol}${amount.toFixed(2)}`;
  };

  return {
    countries,
    currencies,
    exchangeRates,
    loading,
    error,
    getCountryByCode,
    getCurrencyByCode,
    convertCurrency,
    formatCurrencyWithRate
  };
};
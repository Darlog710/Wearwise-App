export type CurrencyCode = 'NGN' | 'USD' | 'GBP' | 'EUR';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  rateFromUSD: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  NGN: {
    code: 'NGN',
    symbol: '₦',
    name: 'Naira',
    flag: '🇳🇬',
    rateFromUSD: 1500,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'Dollar',
    flag: '🇺🇸',
    rateFromUSD: 1.0,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'Pounds',
    flag: '🇬🇧',
    rateFromUSD: 0.78,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    flag: '🇪🇺',
    rateFromUSD: 0.92,
  },
};

/**
 * Converts a base USD amount to the selected currency
 */
export function convertFromUSD(amountUSD: number, currency: CurrencyCode): number {
  const rate = CURRENCIES[currency].rateFromUSD;
  return amountUSD * rate;
}

/**
 * Converts an input amount in selected currency back to base USD
 */
export function convertToUSD(amountInCurrency: number, currency: CurrencyCode): number {
  const rate = CURRENCIES[currency].rateFromUSD;
  return amountInCurrency / rate;
}

/**
 * Formats a base USD amount into the target currency string
 * e.g. formatMoney(120, 'NGN') -> "₦180,000"
 *      formatMoney(120, 'USD') -> "$120"
 */
export function formatMoney(amountUSD: number, currency: CurrencyCode, includeDecimals = false): string {
  const converted = convertFromUSD(amountUSD, currency);
  const symbol = CURRENCIES[currency].symbol;

  if (currency === 'NGN') {
    // For Naira, round to whole numbers for large values, or 2 decimals for small values (< 100)
    if (converted < 100 && includeDecimals) {
      return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `${symbol}${Math.round(converted).toLocaleString()}`;
  }

  // USD, GBP, EUR
  if (includeDecimals || converted % 1 !== 0) {
    return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `${symbol}${Math.round(converted).toLocaleString()}`;
}

/**
 * Formats a unit Cost-Per-Wear value in the selected currency
 * e.g. "₦2,400" or "$3.20"
 */
export function formatCPW(cpwUSD: number, currency: CurrencyCode): string {
  const converted = convertFromUSD(cpwUSD, currency);
  const symbol = CURRENCIES[currency].symbol;

  if (currency === 'NGN') {
    return `${symbol}${Math.round(converted).toLocaleString()}`;
  }
  return `${symbol}${converted.toFixed(2)}`;
}


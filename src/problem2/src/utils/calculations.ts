export const formatNumber = (value: number, decimals: number = 6): string => {
  if (value === 0) return '0';
  
  // For very small numbers, use scientific notation
  if (value < 0.000001) {
    return value.toExponential(2);
  }
  
  // For normal numbers, use fixed decimal places
  const formatted = value.toFixed(decimals);
  
  // Remove trailing zeros
  return formatted.replace(/\.?0+$/, '');
};

export const formatCurrency = (value: number, symbol: string): string => {
  const formatted = formatNumber(value);
  return `${formatted} ${symbol}`;
};

export const parseAmount = (value: string): number => {
  const cleaned = value.replace(/[^\d.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

export const formatAmountInput = (value: string): string => {
  // Remove any non-numeric characters except decimal point
  let cleaned = value.replace(/[^\d.]/g, '');
  
  // Ensure only one decimal point
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    cleaned = parts[0] + '.' + parts.slice(1).join('');
  }
  
  // Limit decimal places to 8
  if (parts.length === 2 && parts[1].length > 8) {
    cleaned = parts[0] + '.' + parts[1].substring(0, 8);
  }
  
  return cleaned;
};

export const calculatePercentageChange = (oldValue: number, newValue: number): number => {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
};

export const roundToSignificantDigits = (value: number, digits: number = 6): number => {
  if (value === 0) return 0;
  
  const magnitude = Math.floor(Math.log10(Math.abs(value)));
  const factor = Math.pow(10, digits - magnitude - 1);
  
  return Math.round(value * factor) / factor;
};

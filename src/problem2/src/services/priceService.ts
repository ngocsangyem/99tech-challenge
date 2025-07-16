import { priceApi, handleApiError } from '@/utils/api';
import type { PriceResponse, PriceMap, ExchangeRate } from '@/types';

export const fetchPrices = async (): Promise<PriceMap> => {
  try {
    const response = await priceApi.get<PriceResponse>('/prices.json');
    
    const priceMap: Record<string, number> = {};
    
    response.data.forEach((priceData) => {
      priceMap[priceData.currency] = priceData.price;
    });
    
    return priceMap;
  } catch (error) {
    const apiError = handleApiError(error);
    throw new Error(`Failed to fetch prices: ${apiError.message}`);
  }
};

export const calculateExchangeRate = (
  priceMap: PriceMap,
  fromSymbol: string,
  toSymbol: string
): ExchangeRate | null => {
  const fromPrice = priceMap[fromSymbol];
  const toPrice = priceMap[toSymbol];
  
  if (!fromPrice || !toPrice || fromPrice <= 0 || toPrice <= 0) {
    return null;
  }
  
  const rate = fromPrice / toPrice;
  
  return {
    fromSymbol,
    toSymbol,
    rate,
  };
};

export const convertAmount = (
  amount: number,
  exchangeRate: ExchangeRate
): number => {
  return amount * exchangeRate.rate;
};

export const getAvailableTokens = (priceMap: PriceMap): string[] => {
  return Object.keys(priceMap).sort();
};

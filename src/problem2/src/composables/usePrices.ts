import { computed } from 'vue';
import { useFetch } from '@vueuse/core';
import { calculateExchangeRate, convertAmount, getAvailableTokens } from '@/services/priceService';
import type { PriceMap, ExchangeRate, PriceResponse, PriceData } from '@/types';

export const usePrices = () => {
  const {
    data: priceData,
    isFetching: isLoading,
    error,
    execute: refetchPrices,
  } = useFetch<PriceResponse>(
    'https://interview.switcheo.com/prices.json',
    {
      immediate: true,
    }
  ).json();

  const priceMap = computed((): PriceMap => {
    if (!priceData.value) return {};

    const map: Record<string, number> = {};
    priceData.value.forEach((priceItem: PriceData) => {
      map[priceItem.currency] = priceItem.price;
    });

    return map;
  });

  const availableTokens = computed(() => {
    return getAvailableTokens(priceMap.value);
  });

  const getPrice = (symbol: string): number | null => {
    return priceMap.value[symbol] || null;
  };

  const hasPrice = (symbol: string): boolean => {
    return symbol in priceMap.value && priceMap.value[symbol] > 0;
  };

  const getExchangeRate = (fromSymbol: string, toSymbol: string): ExchangeRate | null => {
    return calculateExchangeRate(priceMap.value, fromSymbol, toSymbol);
  };

  const convert = (amount: number, fromSymbol: string, toSymbol: string): number | null => {
    const exchangeRate = getExchangeRate(fromSymbol, toSymbol);
    if (!exchangeRate) return null;

    return convertAmount(amount, exchangeRate);
  };

  const canSwap = (fromSymbol: string, toSymbol: string): boolean => {
    return hasPrice(fromSymbol) && hasPrice(toSymbol) && fromSymbol !== toSymbol;
  };

  return {
    priceMap: computed(() => priceMap.value),
    availableTokens,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    getPrice,
    hasPrice,
    getExchangeRate,
    convert,
    canSwap,
    refetchPrices,
  };
};

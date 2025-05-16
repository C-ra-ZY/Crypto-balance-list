import axios from 'axios';
import type { Currency, Rate, Balance, ApiResponse } from '../types';

export const fetchCurrencies = async (): Promise<Currency[]> => {
  const response = await axios.get<ApiResponse<Currency>>('/json/currencies.json');
  return response.data.currencies || [];
};

export const fetchRates = async (): Promise<Rate[]> => {
  const response = await axios.get<ApiResponse<Rate>>('/json/live-rates.json');
  return response.data.tiers || []; 
};

export const fetchBalances = async (): Promise<Balance[]> => {
  const response = await axios.get<ApiResponse<Balance>>('/json/wallet-balance.json');
  return response.data.wallet || []; 
};

export const getLatestRate = (allRates: Rate[], fromCurrencySymbol: string, toCurrencySymbol: string = 'USD'): number => {
  const relevantRates = allRates.filter(
    r => r.from_currency === fromCurrencySymbol && r.to_currency === toCurrencySymbol
  );

  if (relevantRates.length === 0) {
    return 0;
  }

  relevantRates.sort((a, b) => b.time_stamp - a.time_stamp);

  const latestRateInfo = relevantRates[0];

  if (!latestRateInfo.rates || latestRateInfo.rates.length === 0) {
    return 0;
  }

  const rateValue = parseFloat(latestRateInfo.rates[0].rate);
  return isNaN(rateValue) ? 0 : rateValue;
};
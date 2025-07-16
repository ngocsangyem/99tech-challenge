import axios from 'axios';
import type { ApiError } from '@/types';

export const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  timeout: 10000,
  headers: {
    'Accept': 'application/vnd.github.v3+json',
  },
});

export const priceApi = axios.create({
  baseURL: 'https://interview.switcheo.com',
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
  },
});

export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    return {
      message: error.response?.data?.message || error.message || 'An API error occurred',
      code: error.response?.status || error.code,
      details: error.response?.data,
    };
  }
  
  if (error instanceof Error) {
    return {
      message: error.message,
      details: error,
    };
  }
  
  return {
    message: 'An unknown error occurred',
    details: error,
  };
};

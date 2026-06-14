import axios, { AxiosError, AxiosInstance } from 'axios';
import { ApiError } from '@/types/api';

export function createApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error?: { message?: string } }>;
    const status = axiosError.response?.status;
    const message =
      axiosError.response?.data?.error?.message ??
      axiosError.message ??
      'Something went wrong';

    if (status === 401) {
      return { code: 'UNAUTHORIZED', message: 'Invalid API key', status };
    }
    if (status === 429) {
      return { code: 'RATE_LIMIT', message: 'Rate limit exceeded', status };
    }
    if (!axiosError.response) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Network error. Check your connection.',
      };
    }
    return { code: 'API_ERROR', message, status };
  }

  if (error instanceof Error) {
    return { code: 'UNKNOWN', message: error.message };
  }

  if (typeof error === 'string') {
    return { code: 'UNKNOWN', message: error };
  }

  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
  ) {
    return {
      code: 'UNKNOWN',
      message: (error as { message: string }).message,
    };
  }

  return { code: 'UNKNOWN', message: 'An unexpected error occurred' };
}

export function createApiClient(getApiKey: () => string): AxiosInstance {
  const client = axios.create({
    baseURL: 'https://api.openai.com/v1',
    timeout: 30000,
    headers: { 'Content-Type': 'application/json' },
  });

  client.interceptors.request.use(config => {
    const apiKey = getApiKey();
    if (apiKey) {
      config.headers.Authorization = `Bearer ${apiKey}`;
    }
    return config;
  });

  return client;
}

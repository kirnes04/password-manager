import { api } from './api';
import { AxiosError } from 'axios';

export interface PasswordCheckRequest {
  password: string;
}

export interface PasswordCheckResult {
  isCompromised: boolean;
  count: number | null;
}

export class PasswordCheckError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PasswordCheckError';
  }
}

export const checkPassword = async (password: string): Promise<PasswordCheckResult> => {
  if (!password || password.trim().length === 0) {
    throw new PasswordCheckError('Password cannot be empty');
  }

  try {
    const response = await api.get<PasswordCheckResult>(`/api/hibp/check?password=${encodeURIComponent(password)}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 400) {
        throw new PasswordCheckError(error.response.data as string);
      }
      if (error.response?.status === 403) {
        throw new PasswordCheckError('You are not authorized to perform this action');
      }
      if (error.response?.status === 429) {
        throw new PasswordCheckError('Too many requests. Please try again later');
      }
      if (error.response?.status === 503) {
        throw new PasswordCheckError('Service temporarily unavailable. Please try again later');
      }
    }
    console.error('Error checking password:', error);
    throw new PasswordCheckError('Failed to check password. Please try again later');
  }
}; 
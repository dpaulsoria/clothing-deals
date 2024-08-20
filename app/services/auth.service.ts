// app/services/auth.service.ts
'use client';
import { ApiResponse, apiService } from './api.service';
import { User } from '@/db/models/user.model';
import { hash } from 'bcryptjs';

export const AuthService = {
  // Inicio de sesión
  async loginUser(
    email: string,
    password: string
  ): Promise<Partial<User> | null> {
    const response: ApiResponse<Partial<User>> = await apiService.post(
      '/login',
      { email, password }
    );
    if (response) return response.result;
    else return null;
  },

  async sendEmailRecoverPassword(email: string): Promise<{ email: string }> {
    const response: ApiResponse<{ email: string }> = await apiService.post(
      '/recover-password',
      { email }
    );
    if (response) return response.result;
    else return null;
  },

  async verifyTokenRecoverPassword(
    email: string,
    token: string,
    type: string
  ): Promise<{
    email: string;
    token: string;
    type: string;
  }> {
    const response: ApiResponse<{
      email: string;
      token: string;
      type: string;
    }> = await apiService.post(`/verify-token`, { email, token, type });
    if (response) return response.result;
    else return null;
  },

  async changePassword(
    email: string,
    password: string
  ): Promise<{
    email: string;
    password: string;
  }> {
    const response: ApiResponse<{
      email: string;
      password: string;
    }> = await apiService.post(`/reset-password`, { email, password });
    if (response) return response.result;
    else return null;
  },
};

// app/services/api.service.ts
'use client';
import axios, { AxiosResponse, AxiosError } from 'axios';
import {
  Responses,
  CustomResponse,
  ApiRestResponse,
} from '@utils/customResponse';

const url: string =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface ApiResponse<T> {
  result?: T;
  extra?: string;
}

export const apiService = {
  get: async <T>(path: string): Promise<ApiResponse<T> | null> => {
    console.log(`GET request to ${url}api${path}`);
    try {
      const response: AxiosResponse<ApiResponse<T>> = await axios.get(
        `${url}api${path}`
      );
      console.log(`GET response from ${url}api${path}`, response.data);
      if (response.data.result) {
        return response.data;
      } else {
        console.error('GET response does not contain result');
        return null;
      }
    } catch (error) {
      console.error(`Error during GET request to ${url}api${path}`, error);
      handleApiError(error, 'get' as keyof CustomResponse, 'get');
      return null;
    }
  },

  post: async <T>(path: string, data: T): Promise<ApiResponse<T> | null> => {
    console.log(`POST request to ${url}api${path}`, data);

    try {
      const response: AxiosResponse<ApiResponse<T>> = await axios.post(
        `${url}api${path}`,
        data
      );
      console.log(`POST response from ${url}api${path}`, response.data);
      if (response.data.result) {
        return response.data;
      } else {
        console.error('POST response does not contain result');
        return null;
      }
    } catch (error) {
      console.error(`Error during POST request to ${url}api${path}`, error);
      handleApiError(error, 'post' as keyof CustomResponse, 'post');
      return null;
    }
  },

  put: async <T>(path: string, data: T): Promise<ApiResponse<T> | null> => {
    console.log(`PUT request to ${url}api${path}`, data);

    try {
      const response: AxiosResponse<ApiResponse<T>> = await axios.put(
        `${url}api${path}`,
        data
      );
      console.log(`PUT response from ${url}api${path}`, response.data);
      if (response.data.result) {
        return response.data;
      } else {
        console.error('PUT response does not contain result');
        return null;
      }
    } catch (error) {
      console.error(`Error during PUT request to ${url}api${path}`, error);
      handleApiError(error, 'put' as keyof CustomResponse, 'put');
      return null;
    }
  },

  delete: async <T>(path: string): Promise<ApiResponse<T> | null> => {
    console.log(`DELETE request to ${url}api${path}`);

    try {
      const response: AxiosResponse<ApiResponse<T>> = await axios.delete(
        `${url}api${path}`
      );
      console.log(`DELETE response from ${url}api${path}`, response.data);
      if (response.data.result) {
        return response.data;
      } else {
        console.error('DELETE response does not contain result');
        return null;
      }
    } catch (error) {
      console.error(`Error during DELETE request to ${url}api${path}`, error);
      handleApiError(error, 'delete' as keyof CustomResponse, 'delete');
      return null;
    }
  },
};

function handleApiError(
  error: AxiosError,
  key: keyof CustomResponse,
  method: keyof ApiRestResponse
) {
  if (error.response) {
    switch (error.response.status) {
      case 404:
        console.error(Responses[key][method].notFound, error.response.data);
        throw new Error(Responses[key][method].notFound);
      case 500:
        console.error(Responses[key][method].serverError, error.response.data);
        throw new Error(Responses[key][method].serverError);
      default:
        console.error(
          'Unexpected error:',
          error.response.statusText,
          error.response.data
        );
        throw new Error('Unexpected error');
    }
  } else if (error.request) {
    console.error('No response received:', error.request);
    throw new Error('No response received');
  } else {
    console.error('Error setting up request:', error.message);
    throw new Error('Error setting up request');
  }
}

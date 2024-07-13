import { LoginApiResponse, RefreshApiResponse } from '../model/authType';
import { axiosInstance } from '../axios/axiosInstance';

export const login = async (username: string, password: string) => {
  const response = await axiosInstance.post<LoginApiResponse>('/api/login', {
    username,
    password
  });
  return response;
};

export const validateToken = async () => {
  const response = await axiosInstance.get('/api/validate');
  return response;
};

export const refreshToken = async () => {
  const response = await axiosInstance.get<RefreshApiResponse>('/api/refresh');
  return response;
};

export const logout = async () => {
  const response = await axiosInstance.get('/api/logout');
  return response;
};

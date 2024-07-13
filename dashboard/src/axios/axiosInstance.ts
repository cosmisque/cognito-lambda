import { AxiosConfig } from './axiosConfig';

export const axiosInstance = new AxiosConfig(
  import.meta.env.VITE_API_GATEWAY_URL
);

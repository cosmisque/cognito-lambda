import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse
} from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

export class AxiosConfig {
  private readonly axiosInstance: AxiosInstance;

  constructor(baseUrl: string) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        if (error?.response?.data?.error) {
          if (error?.response?.data?.error !== 'Invalid refresh token') {
            toast.error(error?.response?.data?.error);
          }
        }
        return error?.response?.data?.error;
      }
    );
  }

  public setAuthToken(idToken: string) {
    this.axiosInstance.defaults.headers.common.Authorization = `${idToken}`;
  }

  public removeAuthToken() {
    delete this.axiosInstance.defaults.headers.common.Authorization;
  }

  public async post<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post<T>(
      url,
      data
    );
    return response.data;
  }

  public async get<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.get<T>(
      url,
      data
    );
    return response.data;
  }

  public async put<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.put<T>(
      url,
      data
    );
    return response.data;
  }

  public async delete<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete<T>(
      url,
      data
    );
    return response.data;
  }
}

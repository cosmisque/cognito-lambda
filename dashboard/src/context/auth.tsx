import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  login as loginApi,
  logout as logoutApi,
  refreshToken
} from '../api/authApi';
import { LoginApiResponse, RefreshApiResponse } from '../model/authType';
import { axiosInstance } from '../axios/axiosInstance';

interface AuthContextType {
  isAuthenticated: boolean | null;
  login: (username: string, password: string) => Promise<LoginApiResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return authContext;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [isAuthenticated, setAuthenticated] = useState<boolean | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    refreshToken().then((res: RefreshApiResponse) => {
      if (!res) {
        setAuthenticated(false);
      } else {
        const { IdToken: idToken } = res;
        axiosInstance.setAuthToken(idToken);
        setAuthenticated(true);
      }
    });
  }, [isAuthenticated]);

  const login = async (username: string, password: string) => {
    const res = await loginApi(username, password);
    if (res) {
      const { IdToken: idToken } = res;
      setAuthenticated(true);
      axiosInstance.setAuthToken(idToken);
    }
    return res;
  };

  const logout = () => {
    setAuthenticated(false);
    logoutApi();
    axiosInstance.removeAuthToken();
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

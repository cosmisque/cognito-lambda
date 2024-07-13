import {
  ICreateUser,
  IUserPool,
  UpdateUser,
  UsersApiResponse
} from '../model/userType';
import { axiosInstance } from '../axios/axiosInstance';

export const fetchUserPools = async () => {
  const response = await axiosInstance.get<IUserPool[]>('/api/list-user-pools');
  return response;
};

export const fetchUsersInPool = async (userPoolId: string) => {
  const url = `/api/list-users?userPoolId=${userPoolId}`;
  const response = await axiosInstance.get<UsersApiResponse[]>(url);
  return response;
};

export const fetchCustomAttributes = async (userPoolId: string) => {
  const response = await axiosInstance.get(
    `/api/get-pool-attributes?userPoolId=${userPoolId}`
  );
  return response;
};

export const createUserInPool = async (formValue: ICreateUser) => {
  const response = await axiosInstance.post<{ error?: string }>(
    `/api/create-user`,
    formValue
  );
  return response;
};

export const deleteUser = async (username: string, userPoolId: string) => {
  console.log(username, userPoolId);
  const response = await axiosInstance.delete<{ error?: string }>(
    `/api/delete-user`,
    {
      data: { username, userPoolId }
    }
  );
  return response;
};

export const updateUser = async ({
  userPoolId,
  username,
  userAttributes
}: UpdateUser) => {
  const response = await axiosInstance.put<{ error?: string }>(
    `/api/update-user`,
    {
      userPoolId,
      username,
      userAttributes
    }
  );
  return response;
};

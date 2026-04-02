
import { apiClient } from "../../lib/axios/apiClient";
import { userEndpoints } from "./endpoints";

export type TUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
  status: "ACTIVE" | "BLOCKED";
  fullName?: string | null;
  country?: string | null;
  city?: string | null;
  area?: string | null;
  addressLine?: string | null;
  profileImage?: string | null;
  phone?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
};

export type TLoginPayload = {
  email: string;
  password: string;
};

export type TRegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type TLoginResponse = {
  accessToken: string;
  user: TUser;
};

export const registerUserApi = async (payload: TRegisterPayload) => {
  const res = await apiClient.post<TApiResponse<TUser>>(
    userEndpoints.register,
    payload
  );
  return res.data;
};

export const loginUserApi = async (payload: TLoginPayload) => {
  const res = await apiClient.post<TApiResponse<TLoginResponse>>(
    userEndpoints.login,
    payload
  );
  return res.data;
};

export const getMeApi = async () => {
  const res = await apiClient.get<TApiResponse<TUser>>(userEndpoints.me);
  return res.data;
};



export const updateUserApi = async ({
  id,
  payload,
}: {
  id: string;
  payload: FormData;
}) => {
  const res = await apiClient.patch(
    userEndpoints.UPDATE_USER(id),
    payload,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};
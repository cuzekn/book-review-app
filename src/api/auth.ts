/* eslint-disable @typescript-eslint/member-ordering */
import { apiClient } from './client';

// 型定義
export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserIconResponse {
  iconUrl: string;
}

export interface AuthResponse {
  token: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  iconUrl?: string;
}

// 認証API
export const authApi = {
  // ユーザー登録
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/users', data);
    // トークンをlocalStorageに保存
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  // ログイン
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/signin', data);
    // トークンをlocalStorageに保存
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  // ユーザー情報取得
  getUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/users');
    return response.data;
  },

  // アイコン画像アップロード
  uploadIcon: async (file: File): Promise<UserIconResponse> => {
    const formData = new FormData();
    formData.append('icon', file);

    const response = await apiClient.post<UserIconResponse>(
      '/uploads',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  },

  // ユーザー名更新
  putName: async (name: string): Promise<User> => {
    const response = await apiClient.put<User>('/users', { name });
    return response.data;
  },
};

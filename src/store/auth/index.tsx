/* eslint-disable @typescript-eslint/member-ordering */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { authApi } from '../../api';
import type { User } from '../../api/auth';

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      // localStorageからトークンを削除
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    // 共通のpending処理
    const handlePending = (state: AuthState) => {
      state.loading = true;
      state.error = null;
    };

    // 共通のfulfilled処理
    const handleFulfilled = (
      state: AuthState,
      action: PayloadAction<{ token: string; user: User }>,
    ) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    };

    builder
      // loginUser
      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, handleFulfilled)
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'ログインに失敗しました';
      })
      // signupUser
      .addCase(signupUser.pending, handlePending)
      .addCase(signupUser.fulfilled, handleFulfilled)
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? '新規登録に失敗しました';
      })
      // initializeAuth
      .addCase(initializeAuth.pending, handlePending)
      .addCase(initializeAuth.fulfilled, handleFulfilled)
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        // トークンが無効な場合はlocalStorageからも削除
        localStorage.removeItem('token');
      });
  },
});

export const { logout } = authSlice.actions;

// ユーザーログインの非同期thunk
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }) => {
    const response = await authApi.login(credentials);
    // ログイン後にユーザー情報を取得
    const user = await authApi.getUser();
    return { token: response.token, user };
  },
);

// ユーザー新規登録の非同期thunk
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (credentials: { email: string; name: string; password: string }) => {
    const response = await authApi.signup(credentials);
    // 新規登録後にユーザー情報を取得
    const user = await authApi.getUser();
    return { token: response.token, user };
  },
);

// 認証状態を初期化する非同期thunk
export const initializeAuth = createAsyncThunk(
  'auth/initializeAuth',
  async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    // トークンが存在する場合、ユーザー情報を取得
    const user = await authApi.getUser();
    return { token, user };
  },
);

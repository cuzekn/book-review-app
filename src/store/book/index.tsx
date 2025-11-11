import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { bookApi } from '../../api';
import type { Book } from '../../api';

export interface PageState {
  books: Book[];
  error: string | null;
  hasMore: boolean;
  limit: number;
  loading: boolean;
  offset: number;
}

const initialState: PageState = {
  books: [],
  error: null,
  hasMore: true,
  limit: 10,
  loading: false,
  offset: 0,
};

// 書籍データを取得する非同期thunk
export const fetchBooks = createAsyncThunk(
  'page/fetchBooks',
  async (params: { limit: number; offset: number }) => {
    const books = await bookApi.getBooks(params);
    return books;
  },
);

// 次のページへ移動
export const nextPage = createAsyncThunk(
  'page/nextPage',
  async (_, { getState, dispatch }) => {
    const state = getState() as { page: PageState };
    const newOffset = state.page.offset + 1;
    await dispatch(fetchBooks({ offset: newOffset, limit: state.page.limit }));
    return newOffset;
  },
);

// 前のページへ移動
export const prevPage = createAsyncThunk(
  'page/prevPage',
  async (_, { getState, dispatch }) => {
    const state = getState() as { page: PageState };
    const newOffset = Math.max(state.page.offset - 1, 0);
    await dispatch(fetchBooks({ offset: newOffset, limit: state.page.limit }));
    return newOffset;
  },
);

export const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    resetPagination: (state) => {
      state.offset = 0;
      state.books = [];
      state.error = null;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchBooksの処理
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      }) //リクエスト開始時
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
        state.hasMore = action.payload.length === state.limit;
      }) //リクエスト成功時
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? '書籍の取得に失敗しました';
      }) //リクエスト失敗時

      // nextPageの処理
      .addCase(nextPage.fulfilled, (state, action) => {
        state.offset = action.payload;
      })
      // prevPageの処理
      .addCase(prevPage.fulfilled, (state, action) => {
        state.offset = action.payload;
      });
  },
});

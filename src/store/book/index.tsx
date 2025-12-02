/* eslint-disable @typescript-eslint/member-ordering */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { bookApi } from '../../api';
import type { Book, CreateBookRequest } from '../../api';

export interface AsyncState {
  loading: boolean;
  error: string | null;
}

const initialAsyncState: AsyncState = {
  loading: false,
  error: null,
};

export interface PageState extends AsyncState {
  books: Book[];
  hasMore: boolean;
  limit: number;
  offset: number;
}

const initialState: PageState = {
  ...initialAsyncState,
  books: [],
  hasMore: true,
  limit: 10,
  offset: 0,
};

export interface CreateBookState extends AsyncState {
  book: CreateBookRequest | null;
  success: boolean;
}

const initialCreateBookState: CreateBookState = {
  ...initialAsyncState,
  book: null,
  success: false,
};

// 書籍を投稿する際の非同期thunk
export const createBook = createAsyncThunk(
  'page/createBook',
  async (data: CreateBookRequest): Promise<Book> => {
    const book = await bookApi.createBook(data);
    return book;
  },
);

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

export const postSlice = createSlice({
  name: 'post',
  initialState: initialCreateBookState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createBook.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.loading = false;
        state.book = action.payload;
        state.success = true;
      })
      .addCase(createBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? '書籍の作成に失敗しました';
        state.success = false;
      });
  },
});

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

export interface BookDetailState extends AsyncState {
  book: Book | null;
}

const initialBookDetailState: BookDetailState = {
  ...initialAsyncState,
  book: null,
};

export const detailBook = createAsyncThunk(
  'bookDetail/fetchById',
  async (id: string): Promise<Book> => {
    const book = await bookApi.getBookById(id);
    return book;
  },
);

export const bookDetailSlice = createSlice({
  name: 'bookDetail',
  initialState: initialBookDetailState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(detailBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(detailBook.fulfilled, (state, action) => {
        state.loading = false;
        state.book = action.payload;
      })
      .addCase(detailBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? '書籍の取得に失敗しました';
      });
  },
});

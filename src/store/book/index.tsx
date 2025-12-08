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
  reducers: {
    clearBookDetail: (state) => {
      state.book = null;
      state.loading = false;
      state.error = null;
    },
  },
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

export const { clearBookDetail } = bookDetailSlice.actions;

// 書籍を更新する際の非同期thunk
export interface UpdateBookParams extends AsyncState {
  book: Book | null;
  success: boolean;
}

const initialUpdateBookState: UpdateBookParams = {
  ...initialAsyncState,
  book: null,
  success: false,
};

export const updateBook = createAsyncThunk(
  'updateBook/update',
  async (params: { id: string; data: CreateBookRequest }): Promise<Book> => {
    const book = await bookApi.updateBook(params.id, params.data);
    return book;
  },
);

export const updateBookSlice = createSlice({
  name: 'updateBook',
  initialState: initialUpdateBookState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateBook.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.loading = false;
        state.book = action.payload;
        state.success = true;
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? '書籍の更新に失敗しました';
        state.success = false;
      });
  },
});

// 書籍を削除する際の非同期thunk
export const deleteBook = createAsyncThunk(
  'deleteBook/delete',
  async (id: string): Promise<void> => {
    await bookApi.deleteBook(id);
  },
);

export interface DeleteBookState extends AsyncState {
  success: boolean;
}

const initialDeleteBookState: DeleteBookState = {
  ...initialAsyncState,
  success: false,
};

export const deleteBookSlice = createSlice({
  name: 'deleteBook',
  initialState: initialDeleteBookState,
  reducers: {
    resetDeleteState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteBook.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteBook.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? '書籍の削除に失敗しました';
        state.success = false;
      });
  },
});

export const { resetDeleteState } = deleteBookSlice.actions;

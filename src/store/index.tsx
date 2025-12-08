import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';

import { configureStore } from '@reduxjs/toolkit';

import { authSlice } from './auth';
import {
  bookDetailSlice,
  deleteBookSlice,
  pageSlice,
  updateBookSlice,
} from './book';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    page: pageSlice.reducer,
    bookDetail: bookDetailSlice.reducer,
    updateBook: updateBookSlice.reducer,
    deleteBook: deleteBookSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Redux hooksの型付き版を作成
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

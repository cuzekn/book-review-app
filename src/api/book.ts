/* eslint-disable @typescript-eslint/member-ordering */
import { apiClient } from './client';

export interface Book {
  id: string;
  title: string;
  url: string;
  detail: string;
  review: string;
  reviewer: string;
}

export interface BookSearchParams {
  offset?: number;
  limit?: number;
}

export const bookApi = {
  // 書籍リストの取得
  getBooks: async (params?: BookSearchParams): Promise<Book[]> => {
    const response = await apiClient.get<Book[]>('/public/books', { params });
    return response.data;
  },
};

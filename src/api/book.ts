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

export interface CreateBookRequest {
  title: string;
  url: string;
  detail: string;
  review: string;
}

export const bookApi = {
  // 書籍リストの取得
  getBooks: async (params?: BookSearchParams): Promise<Book[]> => {
    const response = await apiClient.get<Book[]>('/public/books', { params });
    return response.data;
  },

  // 書籍の個別取得
  getBookById: async (id: string): Promise<Book> => {
    const response = await apiClient.get<Book>(`/books/${id}`);
    return response.data;
  },

  // 書籍の新規作成
  createBook: async (data: CreateBookRequest): Promise<Book> => {
    const response = await apiClient.post<Book>('/books', data);
    return response.data;
  },
};

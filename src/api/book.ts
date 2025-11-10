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

export const bookApi = {
  // 書籍リストの取得
  getBooks: async (): Promise<Book[]> => {
    const response = await apiClient.get<Book[]>('/public/books');
    return response.data;
  },
};

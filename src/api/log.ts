import { apiClient } from './client';

export interface LogBookSelectionRequest {
  selectBookId: string;
}

export const logApi = {
  // 書籍選択ログの送信
  logBookSelection: async (bookId: string): Promise<void> => {
    await apiClient.post('/logs', { selectBookId: bookId });
  },
};

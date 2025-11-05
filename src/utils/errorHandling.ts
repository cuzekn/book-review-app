import axios, { AxiosError } from 'axios';

// APIエラーレスポンスの型定義
type ApiErrorData = {
  ErrorCode?: number;
  ErrorMessageEN?: string;
  ErrorMessageJP?: string;
};

/**
 * AxiosErrorから適切なエラーメッセージを取得する
 * @param error - AxiosError
 * @param statusMessages - ステータスコードごとのカスタムメッセージ
 * @param defaultMessage - デフォルトのエラーメッセージ
 * @returns エラーメッセージ
 */
const getAxiosErrorMessage = (
  error: AxiosError,
  statusMessages: Record<number, string> = {},
  defaultMessage: string,
): string => {
  const status = error.response?.status;

  // ステータスコードに対応するメッセージがあれば返す
  if (status && statusMessages[status]) {
    return statusMessages[status];
  }

  // APIから返されたエラーメッセージを取得
  const errorData = error.response?.data as ApiErrorData | undefined;
  return (
    errorData?.ErrorMessageJP ?? errorData?.ErrorMessageEN ?? defaultMessage
  );
};

/**
 * 未知のエラーから適切なエラーメッセージを取得する
 * @param error - 未知のエラー
 * @param defaultMessage - デフォルトのエラーメッセージ
 * @param statusMessages - ステータスコードごとのカスタムメッセージ
 * @returns エラーメッセージ
 */
export const getApiErrorMessage = (
  error: unknown,
  defaultMessage: string,
  statusMessages?: Record<number, string>,
): string => {
  if (!axios.isAxiosError(error)) {
    return defaultMessage;
  }

  return getAxiosErrorMessage(error, statusMessages ?? {}, defaultMessage);
};

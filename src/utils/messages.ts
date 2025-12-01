/**
 * アプリケーション全体で使用する共通メッセージ
 */

// 認証関連のエラーメッセージ
export const AUTH_MESSAGES = {
  LOGIN_REQUIRED: 'ログインが必要です',
  UNAUTHORIZED: '認証に失敗しました',
} as const;

// 書籍レビュー関連のエラーメッセージ
export const REVIEW_MESSAGES = {
  REVIEW_REQUIRED: '評価を選択してください',
} as const;

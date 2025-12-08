export const EMAIL_VALIDATION = {
  required: 'メールアドレスは必須です',
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'メールアドレスの形式が正しくありません',
  },
} as const;

export const PASSWORD_VALIDATION = {
  required: 'パスワードは必須です',
  minLength: {
    value: 6,
    message: 'パスワードは6文字以上である必要があります',
  },
} as const;

export const NAME_VALIDATION = {
  required: 'ユーザー名は必須です',
  minLength: {
    value: 2,
    message: 'ユーザー名は2文字以上である必要があります',
  },
} as const;

// 書籍レビュー投稿用のバリデーション
export const TITLE_VALIDATION = {
  required: 'タイトルは必須です',
} as const;

export const URL_VALIDATION = {
  required: 'URLは必須です',
  pattern: {
    value: /^https?:\/\/.+/i,
    message: '正しいURL形式で入力してください',
  },
} as const;

export const DETAIL_VALIDATION = {
  required: '詳細は必須です',
} as const;

export const REVIEW_VALIDATION = {
  required: '感想は必須です',
} as const;

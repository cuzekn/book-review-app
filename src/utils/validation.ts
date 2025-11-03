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

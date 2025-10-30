import { useState, type ChangeEvent, type FormEvent } from 'react';

interface FormErrors {
  email?: string;
  password?: string;
}

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState({ email: false, password: false });

  // メールアドレスのバリデーション
  const validateEmail = (value: string): string | undefined => {
    if (!value) {
      return 'メールアドレスは必須です';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'メールアドレスの形式が正しくありません';
    }
    return undefined;
  };

  // パスワードのバリデーション
  const validatePassword = (value: string): string | undefined => {
    if (!value) {
      return 'パスワードは必須です';
    }
    if (value.length < 8) {
      return 'パスワードは8文字以上である必要があります';
    }
    return undefined;
  };

  // フォーム全体のバリデーション
  const validateForm = (): boolean => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    return !emailError && !passwordError;
  };

  // メールアドレス変更時
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // リアルタイムバリデーション（タッチ済みの場合のみ）
    if (touched.email) {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(value),
      }));
    }
  };

  // パスワード変更時
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    // リアルタイムバリデーション（タッチ済みの場合のみ）
    if (touched.password) {
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(value),
      }));
    }
  };

  // フォーカスが外れた時
  const handleEmailBlur = () => {
    setTouched((prev) => ({ ...prev, email: true }));
    setErrors((prev) => ({
      ...prev,
      email: validateEmail(email),
    }));
  };

  const handlePasswordBlur = () => {
    setTouched((prev) => ({ ...prev, password: true }));
    setErrors((prev) => ({
      ...prev,
      password: validatePassword(password),
    }));
  };

  // フォーム送信
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 全てのフィールドをタッチ済みにする
    setTouched({ email: true, password: true });

    // バリデーション実行
    if (validateForm()) {
      // ログイン処理（ここでは仮の処理）
      console.log('ログイン成功:', { email, password });
      alert('ログイン処理を実行します');
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col items-center justify-center p-16 bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
        <div className="text-5xl font-bold mb-6 tracking-tight">
          📚 BookReview
        </div>
        <p className="text-xl text-center opacity-95 leading-relaxed max-w-md mb-12">
          あなたの読書体験を共有し、新しい本との出会いを見つけよう
        </p>
        <div className="flex flex-col gap-5 max-w-md w-full">
          <div className="flex items-center gap-4 text-base opacity-90">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 text-2xl">
              📖
            </div>
            <div>書籍のレビューを投稿・閲覧</div>
          </div>
          <div className="flex items-center gap-4 text-base opacity-90">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 text-2xl">
              ⭐
            </div>
            <div>5段階評価で本を評価</div>
          </div>
          <div className="flex items-center gap-4 text-base opacity-90">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 text-2xl">
              👥
            </div>
            <div>読書好きのコミュニティ</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 lg:p-16 bg-base-100">
        <div className="card w-full max-w-md">
          <div className="card-body">
            <h1 className="card-title text-4xl font-bold mb-3">ログイン</h1>
            <p className="text-base-content/60 mb-8">
              アカウントにログインして、書籍レビューを始めましょう
            </p>
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* メールアドレス */}
              <div className="form-control">
                <label htmlFor="email" className="label">
                  <span className="label-text font-semibold">
                    メールアドレス
                  </span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`input input-bordered w-full ${
                    errors.email ? 'input-error' : ''
                  }`}
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  placeholder="example@example.com"
                />
                {errors.email && (
                  <label className="label">
                    <span
                      className="label-text-alt text-error flex items-center gap-1"
                      role="alert"
                    >
                      ⚠ {errors.email}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label htmlFor="password" className="label">
                  <span className="label-text font-semibold">パスワード</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={`input input-bordered w-full ${
                    errors.password ? 'input-error' : ''
                  }`}
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={handlePasswordBlur}
                  placeholder="8文字以上"
                />
                {errors.password && (
                  <label className="label">
                    <span
                      className="label-text-alt text-error flex items-center gap-1"
                      role="alert"
                    >
                      ⚠ {errors.password}
                    </span>
                  </label>
                )}
              </div>

              <button type="submit" className="btn btn-primary w-full">
                ログイン
              </button>
            </form>

            <div className="divider"></div>

            <p className="text-center text-base-content/60">
              アカウントをお持ちでない方は
              <a href="/signup" className="link link-primary ml-1">
                新規登録
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

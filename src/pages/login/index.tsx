import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

import { FormInput } from '../../components/FormInput';
import { useAppDispatch, useAppSelector } from '../../store';
import { loginUser } from '../../store/auth';
import { getApiErrorMessage } from '../../utils/errorHandling';
import { EMAIL_VALIDATION, PASSWORD_VALIDATION } from '../../utils/validation';

type LoginInputs = {
  email: string;
  password: string;
};

export const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, loading } = useAppSelector((state) => state.auth);

  // ログイン済みの場合はホームにリダイレクト
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>();

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      toast.success('ログインに成功しました');
    } catch (error) {
      const errorMessage = getApiErrorMessage(
        error,
        'ログインに失敗しました。もう一度お試しください。',
        {
          401: 'メールアドレスまたはパスワードが正しくありません',
          404: 'メールアドレスまたはパスワードが正しくありません',
        },
      );
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-300 p-8 lg:p-16">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title mb-3 text-4xl font-bold">ログイン</h1>
          <p className="text-base-content/60 mb-8">
            アカウントにログインして、書籍レビューを始めましょう
          </p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-6"
          >
            <FormInput
              label="メールアドレス"
              id="email"
              type="email"
              error={errors.email}
              placeholder="メールアドレス"
              {...register('email', EMAIL_VALIDATION)}
            />

            <FormInput
              label="パスワード"
              id="password"
              type="password"
              error={errors.password}
              placeholder="6文字以上"
              {...register('password', PASSWORD_VALIDATION)}
            />

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>

          <div className="divider"></div>

          <p className="text-base-content/60 text-center">
            アカウントをお持ちでない方は
            <Link to="/signup" className="link link-primary ml-1">
              新規登録
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

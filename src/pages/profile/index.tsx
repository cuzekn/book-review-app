import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { FormInput } from '../../components/FormInput';
import { Header } from '../../components/Header';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout, updateUserName } from '../../store/auth';
import { getApiErrorMessage } from '../../utils/errorHandling';
import { NAME_VALIDATION } from '../../utils/validation';

type UpdateProfileInputs = {
  name: string;
};

export const Profile = () => {
  const { user, loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'プロフィール編集 - Book Review';
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileInputs>({
    defaultValues: {
      name: user?.name ?? '',
    },
  });

  const onSubmit: SubmitHandler<UpdateProfileInputs> = async (data) => {
    try {
      await dispatch(updateUserName(data.name)).unwrap();
      toast.success('プロフィールを更新しました');
      navigate('/');
    } catch (error) {
      const errorMessage = getApiErrorMessage(
        error,
        'プロフィールの更新に失敗しました。もう一度お試しください。',
      );
      toast.error(errorMessage);
    }
  };
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <Header />
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="card-title mb-3 text-3xl font-bold">
              プロフィール編集
            </h1>
            <div className="mb-3 flex flex-row items-center justify-between">
              <p className="text-base-content/60 mb-6">
                ユーザー名を変更できます
              </p>
              <button
                type="button"
                className="btn btn-error px-3 font-bold"
                onClick={handleLogout}
              >
                ログアウト
              </button>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-6"
            >
              <FormInput
                id="name"
                type="text"
                label="ユーザー名"
                placeholder="名前を入力してください。"
                {...register('name', NAME_VALIDATION)}
                error={errors.name}
              />
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? '更新中...' : '更新'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

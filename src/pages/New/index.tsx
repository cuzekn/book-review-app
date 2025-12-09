/* eslint-disable @typescript-eslint/member-ordering */
import { useForm, type SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { FormInput } from '../../components/FormInput';
import { Header } from '../../components/Header';
import { useAppDispatch } from '../../store';
import { createBook } from '../../store/book';
import { getApiErrorMessage } from '../../utils/errorHandling';
import { AUTH_MESSAGES } from '../../utils/messages';
import {
  DETAIL_VALIDATION,
  REVIEW_VALIDATION,
  TITLE_VALIDATION,
  URL_VALIDATION,
} from '../../utils/validation';

type NewBookInputs = {
  title: string;
  url: string;
  detail: string;
  review: string;
};

export const New = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewBookInputs>();

  const onSubmit: SubmitHandler<NewBookInputs> = async (data) => {
    // 認証トークンの確認
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error(AUTH_MESSAGES.LOGIN_REQUIRED);
      navigate('/login');
      return;
    }

    try {
      await dispatch(createBook(data)).unwrap();
      toast.success('投稿しました');
      navigate('/');
    } catch (error) {
      const errorMessage = getApiErrorMessage(
        error,
        '投稿に失敗しました。もう一度お試しください。',
      );
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto max-w-2xl px-4 py-8 pb-24">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="mb-8 text-center text-3xl font-bold">
              書籍レビューを投稿
            </h1>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <FormInput
                type="text"
                id="title"
                label="タイトル"
                placeholder="タイトルを入力して下さい。"
                {...register('title', TITLE_VALIDATION)}
                error={errors.title}
              />
              <FormInput
                type="text"
                id="url"
                label="URL"
                placeholder="https://example.com"
                {...register('url', URL_VALIDATION)}
                error={errors.url}
              />
              <FormInput
                type="text"
                id="detail"
                label="詳細"
                placeholder="詳細を入力して下さい。"
                {...register('detail', DETAIL_VALIDATION)}
                error={errors.detail}
              />
              <FormInput
                type="text"
                id="review"
                label="レビュー"
                placeholder="レビューを入力して下さい。"
                {...register('review', REVIEW_VALIDATION)}
                error={errors.review}
              />
              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => navigate('/')}
                >
                  キャンセル
                </button>
                <button type="submit" className="btn btn-primary btn-wide">
                  投稿する
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

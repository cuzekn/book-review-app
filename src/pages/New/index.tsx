/* eslint-disable @typescript-eslint/member-ordering */
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { FormInput } from '../../components/FormInput';
import { Header } from '../../components/Header';
import { RatingFormField } from '../../components/RatingFormField';
import { useAppDispatch } from '../../store';
import { createBook } from '../../store/book';
import { getApiErrorMessage } from '../../utils/errorHandling';
import { AUTH_MESSAGES, REVIEW_MESSAGES } from '../../utils/messages';
import {
  DETAIL_VALIDATION,
  TITLE_VALIDATION,
  URL_VALIDATION,
} from '../../utils/validation';

type NewBookInputs = {
  title: string;
  url: string;
  detail: string;
};

export const New = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [review, setReview] = useState(0);

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

    // 評価のバリデーション
    if (review === 0) {
      toast.error(REVIEW_MESSAGES.REVIEW_REQUIRED);
      return;
    }

    try {
      const bookData = { ...data, review: review.toString() };
      await dispatch(createBook(bookData)).unwrap();
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
                {...register('title', TITLE_VALIDATION)}
                error={errors.title}
              />
              <FormInput
                type="text"
                id="url"
                label="URL"
                {...register('url', URL_VALIDATION)}
                error={errors.url}
              />
              <FormInput
                type="text"
                id="detail"
                label="詳細"
                {...register('detail', DETAIL_VALIDATION)}
                error={errors.detail}
              />
              <RatingFormField value={review} onChange={setReview} required />
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

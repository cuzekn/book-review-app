/* eslint-disable @typescript-eslint/member-ordering */
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

import { FormInput } from '../../components/FormInput';
import { Header } from '../../components/Header';
import { useAppDispatch } from '../../store';
import { clearBookDetail, detailBook, updateBook } from '../../store/book';
import { getApiErrorMessage } from '../../utils/errorHandling';
import {
  DETAIL_VALIDATION,
  REVIEW_VALIDATION,
  TITLE_VALIDATION,
  URL_VALIDATION,
} from '../../utils/validation';

type BookEditInputs = {
  title: string;
  url: string;
  detail: string;
  review: string;
};

export const BookEdit = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BookEditInputs>();

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    setLoading(true);
    dispatch(detailBook(id))
      .unwrap()
      .then((bookData) => {
        // 自分の書籍でない場合は編集不可
        if (!bookData.isMine) {
          toast.error('この書籍を編集する権限がありません');
          navigate(`/books/${id}`);
          return;
        }

        setValue('title', bookData.title);
        setValue('url', bookData.url);
        setValue('detail', bookData.detail);
        setValue('review', bookData.review);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error ?? '書籍の取得に失敗しました');
        navigate('/');
      });
  }, [dispatch, id, navigate, setValue]);

  const onSubmit = async (data: BookEditInputs) => {
    if (!id) {
      toast.error('書籍IDが見つかりません');
      navigate('/');
      return;
    }

    try {
      await dispatch(updateBook({ id, data })).unwrap();

      // 詳細画面のstateをクリアして、再取得を促す
      dispatch(clearBookDetail());

      toast.success('更新しました');
      navigate(`/books/${id}`);
    } catch (error) {
      const errorMessage = getApiErrorMessage(
        error,
        '更新に失敗しました。もう一度お試しください。',
      );
      toast.error(errorMessage);
    }
  };

  // ローディング中
  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto max-w-4xl px-4 py-8 pb-24">
          <div className="flex items-center justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto max-w-2xl px-4 py-8 pb-24">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="mb-8 text-center text-3xl font-bold">
              書籍レビューを編集
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
                placeholder="URLを入力して下さい。"
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
                label="感想"
                placeholder="感想を入力して下さい。"
                {...register('review', REVIEW_VALIDATION)}
                error={errors.review}
              />
              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => navigate(`/books/${id}`)}
                >
                  キャンセル
                </button>
                <button type="submit" className="btn btn-primary btn-wide">
                  更新する
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

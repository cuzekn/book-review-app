import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { MdDelete } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';

import { logApi } from '../../api';
import { Header } from '../../components/Header';
import { useAppDispatch, useAppSelector } from '../../store';
import { deleteBook, detailBook, resetDeleteState } from '../../store/book';
import { getApiErrorMessage } from '../../utils/errorHandling';

export const BookDetail = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { book, loading } = useAppSelector((state) => state.bookDetail);
  const { loading: isDeleting } = useAppSelector((state) => state.deleteBook);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    // 書籍詳細を取得
    dispatch(detailBook(id))
      .unwrap()
      .catch((error) => {
        toast.error(error ?? '書籍の取得に失敗しました');
        navigate('/');
      });

    // ログを送信
    logApi.logBookSelection(id).catch((error) => {
      console.error('Failed to log book selection:', error);
    });
  }, [dispatch, id, navigate]);

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

  // データがない場合
  if (!book) {
    return (
      <>
        <Header />
        <div className="container mx-auto max-w-4xl px-4 py-8 pb-24">
          <p className="text-center text-gray-500">
            書籍が見つかりませんでした
          </p>
        </div>
      </>
    );
  }

  const handleDelete = async () => {
    if (!window.confirm('本当にこの書籍を削除しますか？')) {
      return;
    }

    try {
      await dispatch(deleteBook(book.id)).unwrap();
      dispatch(resetDeleteState());
      toast.success('書籍を削除しました');
      navigate('/');
    } catch (error) {
      const errorMessage = getApiErrorMessage(
        error,
        '削除に失敗しました。もう一度お試しください。',
      );
      toast.error(errorMessage);
      dispatch(resetDeleteState());
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto max-w-4xl px-4 py-8 pb-24">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="card-title mb-4 text-3xl">{book.title}</h1>

            <div className="divider"></div>

            <div className="space-y-6">
              <div>
                <h2 className="mb-2 text-sm font-semibold text-gray-500">
                  URL
                </h2>
                <a
                  href={book.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-primary break-all"
                >
                  {book.url}
                </a>
              </div>

              <div>
                <h2 className="mb-2 text-sm font-semibold text-gray-500">
                  書籍の詳細
                </h2>
                <p className="whitespace-pre-wrap text-base">{book.detail}</p>
              </div>

              <div>
                <h2 className="mb-2 text-sm font-semibold text-gray-500">
                  感想
                </h2>
                <p className="whitespace-pre-wrap text-base">{book.review}</p>
              </div>

              <div className="divider"></div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">投稿者</p>
                  <p className="font-semibold">{book.reviewer}</p>
                </div>
                <div className="flex items-center gap-4">
                  {book.isMine && (
                    <>
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="btn btn-ghost btn-sm"
                        aria-label="書籍を削除"
                      >
                        {isDeleting ? (
                          <span className="loading loading-spinner loading-sm hover:text-red-50"></span>
                        ) : (
                          <MdDelete size={24} className="text-red-500" />
                        )}
                      </button>
                      <button
                        onClick={() => navigate(`/books/${book.id}/edit`)}
                        className="btn btn-primary px-16"
                        disabled={isDeleting}
                      >
                        編集する
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => navigate('/')}
                    className="btn btn-outline"
                  >
                    一覧に戻る
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

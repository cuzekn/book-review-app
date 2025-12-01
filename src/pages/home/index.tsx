import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

import { BookCard } from '../../components/BookCard';
import { Header } from '../../components/Header';
import { Pagination } from '../../components/Pagination';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchBooks, nextPage, prevPage } from '../../store/book';

export const Home = () => {
  const dispatch = useAppDispatch();
  const { books, error, hasMore, limit, loading, offset } = useAppSelector(
    (state) => state.page,
  );

  // 初回レンダリング時に書籍データを取得
  useEffect(() => {
    dispatch(fetchBooks({ limit, offset }));
  }, [dispatch, limit, offset]);

  // エラーが発生した場合にトーストを表示
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleNext = () => {
    dispatch(nextPage());
  };

  const handlePrev = () => {
    dispatch(prevPage());
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 pb-24">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">書籍一覧</h1>
          <Link to="/new" className="btn btn-primary py-4">
            書籍を追加
          </Link>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </ul>
            {books.length === 0 && !loading && (
              <p className="py-12 text-center text-gray-500">
                書籍が見つかりませんでした
              </p>
            )}
          </>
        )}
      </div>
      <Pagination
        currentPage={offset}
        hasMore={hasMore}
        loading={loading}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </>
  );
};

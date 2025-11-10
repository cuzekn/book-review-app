import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { bookApi } from '../../api';
import type { Book } from '../../api';
import { BookCard } from '../../components/BookCard';
import { Header } from '../../components/Header';

export const Home = () => {
  const [bookList, setBookList] = useState<Book[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const books = await bookApi.getBooks();
        setBookList(books);
      } catch (error) {
        console.error('データ取得エラー:', error);
        toast.error('書籍リストの取得に失敗しました。再度お試しください。');
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">書籍一覧</h1>
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {bookList.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </ul>
      </div>
    </>
  );
};

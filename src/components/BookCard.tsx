import { MdAccountCircle } from 'react-icons/md';
import { Link } from 'react-router-dom';

import type { Book } from '../api';

type BookCardProps = {
  book: Book;
};

export const BookCard = ({ book }: BookCardProps) => {
  return (
    <li className="card bg-base-300 p-6 shadow-md transition-shadow hover:shadow-lg">
      <h3 className="mb-2 text-lg font-bold">{book.title}</h3>
      <a
        href={book.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-3 block truncate text-xs text-blue-500 hover:underline"
      >
        {book.url}
      </a>
      <p className="mb-4 line-clamp-3 text-sm">{book.review}</p>
      <div className="mt-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MdAccountCircle size={28} className="text-gray-400" />
          <p className="text-sm text-gray-400">{book.reviewer}</p>
        </div>
        <Link to={`/books/${book.id}`} className="btn btn-primary btn-sm">
          詳細を見る
        </Link>
      </div>
    </li>
  );
};

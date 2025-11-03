import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div className="hero min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="mb-6 text-5xl font-bold text-white">
            📚 Book Review App
          </h1>
          <p className="mb-8 text-xl text-white/90">
            書籍レビューアプリへようこそ
          </p>
          <Link to="/login" className="btn btn-primary btn-lg">
            ログインページへ
          </Link>
        </div>
      </div>
    </div>
  );
};

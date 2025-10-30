import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { Login } from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

// ホームページコンポーネント
function Home() {
  return (
    <div className="hero min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold text-white mb-6">
            📚 Book Review App
          </h1>
          <p className="text-xl text-white/90 mb-8">
            書籍レビューアプリへようこそ
          </p>
          <Link to="/login" className="btn btn-primary btn-lg">
            ログインページへ
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;

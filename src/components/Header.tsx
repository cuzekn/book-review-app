import { MdAccountCircle } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../store';
import { logout } from '../store/auth';

export const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const userName = user ? user.name : '未設定';

  const handleClickLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          Book Review
        </Link>
      </div>
      <div className="flex">
        {user ? (
          <div
            className="btn btn-ghost cursor-pointer items-center gap-2 hover:bg-base-200"
            onClick={handleClickLogout}
            title="ログアウト"
          >
            {user.iconUrl ? (
              <img
                src={user.iconUrl}
                alt={userName}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <MdAccountCircle size={32} className="btn-circle" />
            )}
            <span className="normal-case">{userName} さん</span>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary">
            ログイン
          </Link>
        )}
      </div>
    </div>
  );
};

import { MdAccountCircle } from 'react-icons/md';
import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          Book Review
        </Link>
      </div>
      <div className="flex gap-2">
        <div className="btn btn-ghost btn-circle">
          <MdAccountCircle size={32} />
        </div>
      </div>
    </div>
  );
};

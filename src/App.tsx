import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

import { Router } from './routes/Router';
import { useAppDispatch } from './store';
import { initializeAuth } from './store/auth';

export default function App() {
  const dispatch = useAppDispatch();

  // アプリ起動時に認証状態を復元
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <div>
      <Router />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

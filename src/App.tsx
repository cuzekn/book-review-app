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

  // システムのダークモード設定に応じてテーマを設定
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      const theme = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
    };

    // 初回設定
    updateTheme(mediaQuery);

    // システム設定の変更を監視
    mediaQuery.addEventListener('change', updateTheme);

    return () => {
      mediaQuery.removeEventListener('change', updateTheme);
    };
  }, []);

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

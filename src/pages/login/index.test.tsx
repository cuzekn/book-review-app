import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Login } from '.';
import { store } from '../../store';

import '@testing-library/jest-dom';

// react-hot-toastをモック化
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('ログイン画面', () => {
  const renderLogin = () => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>,
    );
  };

  it('メールアドレスとパスワードの入力フォームが表示される', () => {
    renderLogin();

    // メールアドレスの入力フォームが表示されていることを確認
    const emailInput = screen.getByLabelText(/メールアドレス|email/i);
    expect(emailInput).toBeInTheDocument();

    // パスワードの入力フォームが表示されていることを確認
    const passwordInput = screen.getByLabelText(/パスワード|password/i);
    expect(passwordInput).toBeInTheDocument();
  });

  it('ログインボタンが表示される', () => {
    renderLogin();

    // ログインボタンが表示されていることを確認
    const loginButton = screen.getByRole('button', { name: /ログイン|login/i });
    expect(loginButton).toBeInTheDocument();
  });
});

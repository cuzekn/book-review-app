import { test, expect } from '@playwright/test';

/**
 * ログイン画面のブラウザテスト
 *
 * テスト項目:
 * - emailなどの入力フォームへの入力値に不備がある場合はエラーメッセージが表示される
 * - 不備がなければエラーメッセージを表示しない
 */

test.describe('ログイン画面', () => {
  test.beforeEach(async ({ page }) => {
    // 各テストの前にログインページにアクセス
    await page.goto('/login');
  });

  test('emailが空の場合、エラーメッセージが表示される', async ({ page }) => {
    // パスワードのみ入力
    await page.fill('input[name="password"]', 'password123');

    // ログインボタンをクリック
    await page.click('button[type="submit"]');

    // エラーメッセージが表示されることを確認
    const errorMessage = page.locator('text=/メールアドレス|email/i').locator('..').locator('text=/必須|required/i');
    await expect(errorMessage).toBeVisible();
  });

  test('emailの形式が不正な場合、エラーメッセージが表示される', async ({ page }) => {
    // 不正なメールアドレスを入力
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'password123');

    // ログインボタンをクリック
    await page.click('button[type="submit"]');

    // エラーメッセージが表示されることを確認
    const errorMessage = page.locator('text=/メールアドレス|email/i').locator('..').locator('text=/形式|format|invalid/i');
    await expect(errorMessage).toBeVisible();
  });

  test('パスワードが空の場合、エラーメッセージが表示される', async ({ page }) => {
    // メールアドレスのみ入力
    await page.fill('input[name="email"]', 'test@example.com');

    // ログインボタンをクリック
    await page.click('button[type="submit"]');

    // エラーメッセージが表示されることを確認
    const errorMessage = page.locator('text=/パスワード|password/i').locator('..').locator('text=/必須|required/i');
    await expect(errorMessage).toBeVisible();
  });

  test('パスワードが短すぎる場合、エラーメッセージが表示される', async ({ page }) => {
    // 短いパスワードを入力
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', '123');

    // ログインボタンをクリック
    await page.click('button[type="submit"]');

    // エラーメッセージが表示されることを確認
    const errorMessage = page.locator('text=/パスワード|password/i').locator('..').locator('text=/文字以上|minimum|短い/i');
    await expect(errorMessage).toBeVisible();
  });

  test('emailとパスワードの両方が空の場合、複数のエラーメッセージが表示される', async ({ page }) => {
    // 何も入力せずにログインボタンをクリック
    await page.click('button[type="submit"]');

    // 複数のエラーメッセージが表示されることを確認
    const emailError = page.locator('input[name="email"]').locator('..').locator('text=/必須|required/i');
    const passwordError = page.locator('input[name="password"]').locator('..').locator('text=/必須|required/i');

    await expect(emailError).toBeVisible();
    await expect(passwordError).toBeVisible();
  });

  test('正しい入力値の場合、エラーメッセージが表示されない', async ({ page }) => {
    // 正しいメールアドレスとパスワードを入力
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');

    // エラーメッセージが存在しないことを確認（送信前）
    const errorMessages = page.locator('[class*="error"], [role="alert"]');
    await expect(errorMessages).toHaveCount(0);
  });

  test('入力値を修正すると、エラーメッセージが消える', async ({ page }) => {
    // 最初は空でエラーを表示
    await page.click('button[type="submit"]');

    const emailError = page.locator('input[name="email"]').locator('..').locator('text=/必須|required/i');
    await expect(emailError).toBeVisible();

    // メールアドレスを入力
    await page.fill('input[name="email"]', 'test@example.com');

    // エラーメッセージが消えることを確認
    await expect(emailError).not.toBeVisible();
  });

  test('リアルタイムバリデーション: 不正な値を入力中にエラーが表示される', async ({ page }) => {
    // 不正なメールアドレスを入力
    await page.fill('input[name="email"]', 'invalid');

    // フォーカスを外す（blur）
    await page.click('input[name="password"]');

    // エラーメッセージが表示されることを確認
    const errorMessage = page.locator('text=/メールアドレス|email/i').locator('..').locator('text=/形式|format|invalid/i');
    await expect(errorMessage).toBeVisible();
  });
});

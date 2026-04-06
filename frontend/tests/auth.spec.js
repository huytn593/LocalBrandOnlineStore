import { test, expect } from '@playwright/test';

test.describe('Kiểm thử Xác thực (Authentication)', () => {

  test('đăng nhập thành công với người dùng đã xác minh', async ({ page }) => {
    // Sửa '/login' thành 'login' để append chính xác vào baseURL
    await page.goto('login');

    // Dùng getByTestId - ổn định nhất, không bị vỡ khi UI thay đổi
    // toBeVisible() đã bao gồm cơ chế auto-wait của Playwright
    await expect(page.getByTestId('email-input')).toBeVisible({ timeout: 10000 });

    await page.getByTestId('email-input').fill('huytakoyaki@gmail.com');
    await page.getByTestId('password-input').fill('123456');
    await page.getByTestId('login-button').click();

    // Đăng nhập thành công → chuyển hướng ra khỏi /login
    await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 10000 });
    await expect(page).not.toHaveURL(/.*login/);
  });

  test('đăng nhập thành công với tài khoản quản trị (admin)', async ({ page }) => {
    await page.goto('login');

    await expect(page.getByTestId('email-input')).toBeVisible({ timeout: 10000 });

    await page.getByTestId('email-input').fill('admin@localbrand.com');
    await page.getByTestId('password-input').fill('admin123');
    await page.getByTestId('login-button').click();

    // Admin login → chuyển hướng khỏi trang đăng nhập
    await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 10000 });
    await expect(page).not.toHaveURL(/.*login/);
  });

  test('đăng nhập thất bại với thông tin đăng nhập sai', async ({ page }) => {
    await page.goto('login');

    await expect(page.getByTestId('email-input')).toBeVisible({ timeout: 10000 });

    await page.getByTestId('email-input').fill('huytakoyaki@gmail.com');
    await page.getByTestId('password-input').fill('wrongpassword123');
    await page.getByTestId('login-button').click();

    // Login sai → thông báo lỗi hiện ra, vẫn ở trang login
    await expect(page).toHaveURL(/.*login/);
  });

});

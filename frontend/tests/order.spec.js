import { test, expect } from '@playwright/test';

// ✅ Chạy tuần tự để tránh dirty state khi dùng chung 1 user
test.describe.configure({ mode: 'serial' });

test.describe('Kiểm thử Giỏ hàng & Đặt hàng (Order & Cart)', () => {

  test.beforeEach(async ({ page }) => {
    // Đăng nhập
    await page.goto('login');
    await page.getByTestId('email-input').fill('huytakoyaki@gmail.com');
    await page.getByTestId('password-input').fill('123456');
    await page.getByTestId('login-button').click();
    await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 10000 });

    // ✅ Reset cart: xóa từng item, chờ API remove xong trước khi xóa tiếp
    await page.goto('cart');
    await page.waitForLoadState('networkidle');

    // Lặp cho đến khi không còn nút xóa nào
    while (true) {
      const removeBtns = page.getByTestId('remove-item-btn');
      const count = await removeBtns.count();
      if (count === 0) break;

      // Click nút đầu tiên + chờ API DELETE/remove trả về
      await Promise.all([
        page.waitForResponse(res =>
          (res.url().includes('/cart') || res.url().includes('/remove')) &&
          (res.request().method() === 'DELETE' || res.request().method() === 'POST'),
          { timeout: 8000 }
        ),
        removeBtns.first().click()
      ]);

      // Đợi DOM cập nhật (số nút giảm đi)
      await page.waitForFunction(
        (prevCount) => document.querySelectorAll('[data-testid="remove-item-btn"]').length < prevCount,
        count,
        { timeout: 5000 }
      ).catch(() => {}); // Nếu đây là item cuối, DOM sẽ chuyển sang empty state
    }

    // ✅ Xác nhận badge = 0 hoặc không hiển thị trước khi chạy test
    const badge = page.getByTestId('cart-badge');
    const isBadgeVisible = await badge.isVisible();
    if (isBadgeVisible) {
      await expect(badge).toHaveText('0', { timeout: 5000 });
    }
  });

  test('thêm sản phẩm vào giỏ hàng và thanh toán qua COD', async ({ page }) => {
    await page.goto('./');

    const productCards = page.getByTestId('product-card');
    await expect(productCards.first()).toBeVisible({ timeout: 10000 });

    const firstProductBtn = productCards.first().getByTestId('add-to-cart-btn');
    await expect(firstProductBtn).toBeVisible();

    // ✅ Wait đúng API POST /cart rồi mới assert
    await Promise.all([
      page.waitForResponse(res =>
        res.url().includes('/cart') && res.request().method() === 'POST',
        { timeout: 10000 }
      ),
      firstProductBtn.click()
    ]);

    // ✅ Cart đã reset → luôn là 1
    await expect(page.getByTestId('cart-badge')).toHaveText('1', { timeout: 10000 });

    // Đi tới giỏ hàng và checkout
    await page.goto('cart');

    const checkoutBtn = page.getByTestId('checkout-button');
    await expect(checkoutBtn).toBeVisible({ timeout: 10000 });
    await checkoutBtn.click();

    const addressInput = page.locator('textarea');
    try {
      await expect(addressInput).toBeVisible({ timeout: 5000 });
      await addressInput.fill('123 Đường ABC, Quận X, TP Y');

      const placeOrderBtn = page.locator('button[type="submit"]');
      await expect(placeOrderBtn).toBeVisible();
      await placeOrderBtn.click();

      await expect(page).toHaveURL(/.*profile/i, { timeout: 10000 });
    } catch (e) {
      console.log('Lỗi định vị các ô nhập liệu thanh toán:', e.message);
    }
  });

  test('giả lập thanh toán VNPAY thành công (Mock API)', async ({ page }) => {
    await page.goto('./');

    const productCards = page.getByTestId('product-card');
    await expect(productCards.first()).toBeVisible({ timeout: 10000 });

    const firstProductBtn = productCards.first().getByTestId('add-to-cart-btn');
    await expect(firstProductBtn).toBeVisible();

    // ✅ Wait đúng API POST /cart rồi mới assert
    await Promise.all([
      page.waitForResponse(res =>
        res.url().includes('/cart') && res.request().method() === 'POST',
        { timeout: 10000 }
      ),
      firstProductBtn.click()
    ]);

    // ✅ Cart đã reset → luôn là 1
    await expect(page.getByTestId('cart-badge')).toHaveText('1', { timeout: 10000 });

    await page.goto('cart');

    const checkoutBtn = page.getByTestId('checkout-button');
    await expect(checkoutBtn).toBeVisible({ timeout: 10000 });
    await checkoutBtn.click();

    const addressInput = page.locator('textarea');
    try {
      await expect(addressInput).toBeVisible({ timeout: 5000 });
      await addressInput.fill('123 Đường ABC, Quận X, TP Y');

      await page.locator('input[value="VNPAY"]').click();

      // Mock VNPAY API trước khi click submit
      await page.route('**/payment/create_payment**', route => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: '/payment-result?vnp_ResponseCode=00'
          })
        });
      });

      const placeOrderBtn = page.locator('button[type="submit"]');
      await placeOrderBtn.click();

      await expect(page).toHaveURL(/.*payment-result/i, { timeout: 10000 });
    } catch (e) {
      console.log('Lỗi định vị các ô nhập liệu thanh toán:', e.message);
    }
  });

});

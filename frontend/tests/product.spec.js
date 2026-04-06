import { test, expect } from '@playwright/test';

test.describe('Kiểm thử Hiển thị Sản phẩm (Product Display)', () => {

  test('hiển thị danh sách sản phẩm trên trang chủ', async ({ page }) => {
    // Truy cập URL gốc nối với baseURL
    await page.goto('./');

    // Dùng getByTestId cho locator chính xác
    const productCards = page.getByTestId('product-card');

    // Chờ cho thẻ sản phẩm đầu tiên xuất hiện
    await expect(productCards.first()).toBeVisible({ timeout: 10000 });
  });

  test('chuyển hướng đến chi tiết sản phẩm chính xác', async ({ page }) => {
    await page.goto('./');

    const productCards = page.getByTestId('product-card');
    await expect(productCards.first()).toBeVisible({ timeout: 10000 });

    // Click sản phẩm đầu tiên thông qua thẻ link <a/>
    await productCards.first().locator('a').first().click();

    // Kiểm tra URL có chuyển hướng sang trang chi tiết /products/{id}
    await expect(page).toHaveURL(/.*\/products\/\w+/);
  });

});

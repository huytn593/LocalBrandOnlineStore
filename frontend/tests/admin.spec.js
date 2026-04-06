import { test, expect } from '@playwright/test';

test.describe('Kiểm thử Quản trị viên (Admin Flow)', () => {

  // Trước mỗi test case: Đăng nhập với tư cách Admin
  test.beforeEach(async ({ page }) => {
    await page.goto('login');
    await page.getByTestId('email-input').fill('admin@localbrand.com');
    await page.getByTestId('password-input').fill('admin123');
    await page.getByTestId('login-button').click();
    
    // Đợi chuyển hướng về Home
    await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 10000 });
  });

  // 1. Quản lý Sản phẩm (BẮT BUỘC)
  test('quản trị viên tạo sản phẩm mới', async ({ page }) => {
    // Điều hướng vào trang quản lý sản phẩm
    await page.goto('admin/products');
    await page.getByTestId('add-product-btn').click();

    // Điền thông tin form
    const productName = `Áo Phông Test ${Date.now()}`;
    await page.getByTestId('product-name').fill(productName);
    await page.getByTestId('product-price').fill('150000');
    await page.getByTestId('product-stock').fill('10');
    await page.getByTestId('product-description').fill('Mô tả test tự động');

    // Chọn category trong MODAL (dùng locator cụ thể để tránh nhặm select khác trên trang)
    // Đợi modal hiện rồi mới chọn
    const modalCategorySelect = page.getByRole('combobox');
    await expect(modalCategorySelect).toBeVisible({ timeout: 5000 });
    await modalCategorySelect.selectOption({ index: 1 });
    
    // Xác nhận category đã được chọn (không phải option truyền thống "Chọn một danh mục")
    await expect(modalCategorySelect).not.toHaveValue('');

    // Click submit
    await page.getByTestId('submit-product').click();

    // Chờ dialog tự đóng - đây là tín hiệu nhận biết thành công chắc chắn nhất
    await expect(page.getByText('Thêm sản phẩm mới')).not.toBeVisible({ timeout: 10000 });

    // Verify sản phẩm xuất hiện trong table
    await expect(page.locator('table').getByText(productName).first()).toBeVisible({ timeout: 10000 });
  });

  // 2. Quản lý Danh mục (NÊN)
  test('quản trị viên thêm category', async ({ page }) => {
    await page.goto('admin/categories');

    await page.getByTestId('add-category-btn').click();
    
    // Tạo id ngẫu nhiên để test không bị đụng độ nếu chạy đi chạy lại nhiều lần
    const randomCategoryName = `Danh mục Test ${Date.now()}`;
    await page.getByTestId('category-name').fill(randomCategoryName);

    await page.getByTestId('submit-category').click();

    // Verify Notification hoặc Table Render
    await expect(page.getByText(randomCategoryName)).toBeVisible({ timeout: 10000 });
  });

  // 3. Quản lý Đơn hàng (RẤT QUAN TRỌNG)
  test('quản trị viên cập nhật trạng thái đơn hàng', async ({ page }) => {
    await page.goto('admin/orders');

    // Lấy đơn hàng đầu tiên hiển thị trên màn quản lý
    const firstOrder = page.getByTestId('order-row').first();
    await expect(firstOrder).toBeVisible({ timeout: 10000 });

    // Trình duyệt đang chạy Tiếng Việt. Option theo `statusTranslations` của react component sẽ là:
    // Chờ xác nhận, Đã xác nhận, Đang giao hàng, Đã giao, Đã hủy
    const selectBox = firstOrder.locator('select');
    await selectBox.selectOption({ label: 'Đã xác nhận' });

    // Cập nhật trạng thái thành công sẽ hiện label mới trong table (kèm color code React)
    await expect(firstOrder).toContainText('Đã xác nhận');
  });

  // 4. Analytics (Test nhẹ)
  test('quản trị viên xem Dashboard thống kê', async ({ page }) => {
    await page.goto('admin/analytics');
    
    // Tương tác siêu nhẹ: Đảm bảo trang load không lỗi UI và hiển thị Card KPI "Tổng doanh thu"
    const totalRevenueKPI = page.getByText('Tổng doanh thu');
    await expect(totalRevenueKPI).toBeVisible({ timeout: 10000 });
    
    const topProductsHeader = page.getByText('Sản phẩm bán chạy nhất');
    await expect(topProductsHeader).toBeVisible({ timeout: 10000 });
  });

});

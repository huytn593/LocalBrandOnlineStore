# Local Brand Online Store

Đây là một ứng dụng thương mại điện tử full-stack được xây dựng với Spring Boot (Backend) và React (Frontend).

## 🚀 Tính năng

### 👥 Dành cho người dùng
- **Xác thực**: Đăng nhập & đăng ký bảo mật.
- **Duyệt sản phẩm**: Xem sản phẩm kèm hình ảnh và chi tiết.
- **Giỏ hàng**: Thêm, cập nhật và xóa sản phẩm trong giỏ.
- **Thanh toán**: Đặt hàng (mô phỏng).
- **Lịch sử đơn hàng**: Xem các đơn hàng trước đó.
- **Đánh giá**: Đánh giá và nhận xét sản phẩm.

### 🛠️ Dành cho Admin
- **Dashboard**: Tổng quan doanh thu và thống kê.
- **Quản lý sản phẩm**: CRUD sản phẩm (Thêm, xem, sửa, xóa).
- **Quản lý danh mục**: CRUD danh mục.
- **Quản lý đơn hàng**: Xem và xử lý đơn hàng.
- **Quản lý người dùng**: Xem và quản lý tài khoản hệ thống.

## 🛠️ Công nghệ sử dụng

### Backend (Java/Spring Boot)
- **Ngôn ngữ**: Java 17  
- **Framework**: Spring Boot 3.x  
- **Cơ sở dữ liệu**: MySQL  
- **Bảo mật**: Spring Security, JWT (JSON Web Tokens)  
- **Truy cập dữ liệu**: Spring Data JPA, Hibernate  
- **Validation**: Spring Validation  
- **Tiện ích**: Lombok, MapStruct  

### Frontend (React)
- **Framework**: React 18  
- **Ngôn ngữ**: JavaScript (ES6+)  
- **Giao diện**: CSS Modules, Responsive Design  
- **Routing**: React Router DOM  
- **Quản lý state**: React Context API  
- **Gọi API**: Axios  
- **Form**: React Hook Form, Yup  

## 📂 Cấu trúc dự án
LocalBrandOnlineStore/
├── backend/ # Ứng dụng Spring Boot
│ ├── src/main/java/com/localbrand/ # Source code Java
│ ├── src/main/resources/ # Cấu hình (application.properties)
│ └── pom.xml # Thư viện Maven
├── frontend/ # Ứng dụng React
│ ├── src/components/ # UI Components tái sử dụng
│ ├── src/pages/ # Các trang
│ ├── src/services/ # Gọi API
│ ├── src/context/ # State toàn cục (AuthContext, CartContext)
│ └── package.json # Thư viện NPM
├── .gitignore # Cấu hình Git
└── README.md # Tài liệu dự án

## 🚀 Bắt đầu

### Yêu cầu môi trường
- **Java 17** trở lên  
- **Maven 3.6** trở lên  
- **Node.js 16** trở lên  
- **NPM** (hoặc Yarn)  
- **MySQL**  

### 1. Cài đặt Backend

```bash
cd backend
Cấu hình database:

Mở file src/main/resources/application.properties
Cập nhật:
spring.datasource.url
username
password

Build project:

mvn clean install

Chạy ứng dụng:

mvn spring-boot:run

Backend chạy tại: http://localhost:8080

2. Cài đặt Frontend
cd frontend

Cài đặt thư viện:

npm install

Cấu hình API:

Mở file src/services/api.js
Đảm bảo:
API_URL = "http://localhost:8080/api"

Chạy ứng dụng:

npm start

Frontend chạy tại: http://localhost:3000

📝 Sử dụng
Tài khoản mặc định

Admin

Email: [EMAIL_ADDRESS]
Password: admin123

User

Email: [EMAIL_ADDRESS]
Password: user123
Dữ liệu mẫu (Seed Data)
node seed-data.js
🤝 Đóng góp
Tạo nhánh:
git checkout -b feature/AmazingFeature
Commit:
git commit -m "Add some AmazingFeature"
Push:
git push origin feature/AmazingFeature
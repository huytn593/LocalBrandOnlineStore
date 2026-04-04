# Local Brand Online Store

This is a full-stack e-commerce application built with Spring Boot (Backend) and React (Frontend).

## 🚀 Features

### 👥 User Features
- **Authentication**: Secure Login & Registration.
- **Product Browsing**: View products with images and details.
- **Shopping Cart**: Add, update, and remove items from the cart.
- **Checkout**: Place orders (Simulated).
- **Order History**: View past orders.
- **Reviews**: Leave reviews and ratings for products.

### 🛠️ Admin Features
- **Dashboard**: Overview of sales and statistics.
- **Product Management**: CRUD operations for products (Create, Read, Update, Delete).
- **Category Management**: CRUD operations for categories.
- **Order Management**: View and manage customer orders.
- **User Management**: View and manage system users.

## 🛠️ Tech Stack

### Backend (Java/Spring Boot)
- **Language**: Java 17
- **Framework**: Spring Boot 3.x
- **Database**: MySQL
- **Security**: Spring Security, JWT (JSON Web Tokens)
- **Data Access**: Spring Data JPA, Hibernate
- **Validation**: Spring Validation
- **Utilities**: Lombok, MapStruct

### Frontend (React)
- **Framework**: React 18
- **Language**: JavaScript (ES6+)
- **Styling**: CSS Modules, Responsive Design
- **Routing**: React Router DOM
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Forms**: React Hook Form, Yup

## 📂 Project Structure

```
LocalBrandOnlineStore/
├── backend/                # Spring Boot Application
│   ├── src/main/java/com/localbrand/    # Java Source Code
│   ├── src/main/resources/   # Configuration (application.properties)
│   └── pom.xml             # Maven Dependencies
├── frontend/               # React Application
│   ├── src/components/     # Reusable UI Components
│   ├── src/pages/          # Page Components
│   ├── src/services/       # API Service Calls
│   ├── src/context/        # Global State (AuthContext, CartContext)
│   └── package.json        # NPM Dependencies
├── .gitignore              # Git Configuration
└── README.md               # Project Documentation
```

## 🚀 Getting Started

### Prerequisites
- **Java 17** or higher
- **Maven 3.6** or higher
- **Node.js 16** or higher
- **NPM** (or Yarn)
- **MySQL** Database

### 1. Backend Setup

1.  **Navigate to backend directory**:
    ```bash
    cd backend
    ```

2.  **Configure Database**:
    - Open `src/main/resources/application.properties`.
    - Update the `spring.datasource.url`, `username`, and `password` to match your MySQL setup.

3.  **Build the project**:
    ```bash
    mvn clean install
    ```

4.  **Run the application**:
    ```bash
    mvn spring-boot:run
    ```
    - The backend will start on `http://localhost:8080`.

### 2. Frontend Setup

1.  **Navigate to frontend directory**:
    ```bash
    cd frontend
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Configure API URL**:
    - Open `src/services/api.js`.
    - Ensure `API_URL` points to your backend (default: `http://localhost:8080/api`).

4.  **Run the application**:
    ```bash
    npm start
    ```
    - The frontend will start on `http://localhost:3000`.

## 📝 Usage

### Default Credentials

**Admin User**:
- Email: [EMAIL_ADDRESS]`
- Password: `admin123`

**Regular User**:
- Email: [EMAIL_ADDRESS]`
- Password: `user123`

### Seed Data
Run the `seed-data.js` script to populate the database with sample products and categories:
```bash
node seed-data.js
```

## 🤝 Contributing
Contributions are welcome! Please follow the standard Git workflow:
1.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
2.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
3.  Push to the branch (`git push origin feature/AmazingFeature`).
4.  Open a Pull Request.
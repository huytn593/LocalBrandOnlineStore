import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Contexts
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Guards
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import Policies from './pages/Policies';
import About from './pages/About';
import FAQ from './pages/FAQ';
import StoreLocator from './pages/StoreLocator';
import Blog from './pages/Blog';

// Protected Customer Pages
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import PaymentResult from './pages/PaymentResult';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import Analytics from './pages/admin/Analytics';
import ProductManager from './pages/admin/ProductManager';
import CategoryManager from './pages/admin/CategoryManager';
import OrderManager from './pages/admin/OrderManager';

function App() {
  const routerBasename = import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL;

  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter basename={routerBasename}>
          <div className="flex flex-col min-h-screen bg-white text-black font-sans">
            <Toaster position="top-right" />
            <Navbar />
            
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/policies" element={<Policies />} />
                <Route path="/about" element={<About />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/stores" element={<StoreLocator />} />
                <Route path="/blog" element={<Blog />} />

                {/* Protected Customer Routes */}
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } />
                <Route path="/payment-result" element={
                  <ProtectedRoute>
                    <PaymentResult />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/profile/edit" element={
                  <ProtectedRoute>
                    <EditProfile />
                  </ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }>
                  <Route index element={<Navigate to="analytics" replace />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="products" element={<ProductManager />} />
                  <Route path="categories" element={<CategoryManager />} />
                  <Route path="orders" element={<OrderManager />} />
                </Route>

                {/* 404 Fallback */}
                <Route path="*" element={
                  <div className="text-center py-20">
                    <h1 className="text-4xl font-bold mb-4">404</h1>
                    <p className="text-gray-500">Page not found</p>
                  </div>
                } />
              </Routes>
            </main>

            <Footer />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

import { Link } from 'react-router-dom';
import { ShoppingCart, LogOut, User as UserIcon, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { resolveAssetUrl } from '../utils/api';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold tracking-tighter shrink-0">
            LOCALBRAND<span className="text-gray-400">.</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-grow justify-center space-x-8 text-xs font-black tracking-widest text-gray-500">
             <Link to="/" className="hover:text-black transition-colors">TRANG CHỦ</Link>
             <Link to="/about" className="hover:text-black transition-colors">VỀ CHÚNG TÔI</Link>
             <Link to="/stores" className="hover:text-black transition-colors">CỬA HÀNG</Link>
             <Link to="/blog" className="hover:text-black transition-colors">LOOKBOOK</Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-6">
            <Link to="/cart" className="relative text-gray-700 hover:text-black transition-colors">
              <ShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-black focus:outline-none"
                >
                  <div className="w-8 h-8 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center font-bold overflow-hidden">
                    {user?.avatarUrl ? (
                      <img src={resolveAssetUrl(user.avatarUrl)} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <img src="/default-avatar.png" alt={user?.name || 'User'} className="w-full h-full object-cover" />
                    )}
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    
                    {isAdmin && (
                      <Link 
                        to="/admin" 
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Bảng điều khiển
                      </Link>
                    )}
                    
                    <Link 
                      to="/profile" 
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <UserIcon className="w-4 h-4 mr-2" />
                      Hồ sơ & Đơn hàng
                    </Link>
                    
                    <button 
                      onClick={() => { logout(); setDropdownOpen(false); }}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-black font-medium">Đăng nhập</Link>
                <Link to="/register" className="text-white bg-black hover:bg-gray-800 px-4 py-1 rounded-md font-medium transition-colors">Đăng ký</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

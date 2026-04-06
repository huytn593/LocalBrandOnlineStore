import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';
import { Trash2, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, itemCount } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
        <div className="bg-gray-100 p-6 rounded-full mb-6">
           <ShoppingBag size={48} className="text-gray-400" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Giỏ hàng của bạn đang trống</h2>
        <p className="text-gray-600 mb-8 max-w-md">Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy khám phá và chọn cho mình sản phẩm yêu thích nhé.</p>
        <Link to="/" className="btn btn-primary px-8 py-3">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Giỏ hàng ({itemCount} sản phẩm)</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items List */}
        <div className="lg:w-2/3">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="hidden md:grid grid-cols-6 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600 tracking-wider uppercase">
              <div className="col-span-3">Sản phẩm</div>
              <div className="text-center">Đơn giá</div>
              <div className="text-center">Số lượng</div>
              <div className="text-right">Thành tiền</div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <div key={item.productId} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 items-center">
                  <div className="col-span-3 flex items-center space-x-4">
                    <div className="w-20 h-24 bg-gray-100 rounded shrink-0 overflow-hidden flex items-center justify-center">
                      {item.imageUrl ? (
                        <img 
                          src={item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:8080${item.imageUrl}`} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-bold text-gray-300">IMG</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 line-clamp-2">{item.name || item.productId}</h3>
                      <button 
                        onClick={() => removeFromCart(item.productId)}
                        className="text-sm text-red-500 hover:text-red-700 mt-2 flex items-center"
                      >
                        <Trash2 size={16} className="mr-1" /> Xóa
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-gray-600 md:text-center mt-4 md:mt-0 font-medium">
                    {formatPrice(item.price)}
                  </div>
                  
                  <div className="flex justify-start md:justify-center items-center mt-4 md:mt-0">
                    <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity - 1, item.price)}
                        className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 transition"
                      >-</button>
                      <span className="px-3 py-1 text-sm font-medium w-10 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.price)}
                        className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 transition"
                      >+</button>
                    </div>
                  </div>
                  
                  <div className="text-right font-bold text-black mt-4 md:mt-0">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Tổng đơn hàng</h2>
            
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính</span>
                <span className="font-medium">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span className="font-medium text-green-600">Miễn phí</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Tổng cộng</span>
                <span className="font-bold text-2xl">{formatPrice(cartTotal)}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Đã bao gồm VAT. Phí vận chuyển được tính ở bước thanh toán.</p>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full btn btn-primary py-4 text-sm tracking-widest uppercase"
            >
              Thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

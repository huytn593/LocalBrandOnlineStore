import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/orderService';
import { formatPrice } from '../utils/formatters';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { buildPaymentMockUrl } from '../utils/payment';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);

  // If someone directly routes to checkout with empty cart
  if (cartItems.length === 0 && !loading) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Không có sản phẩm để thanh toán</h2>
        <Link to="/" className="text-black underline">Quay lại cửa hàng</Link>
      </div>
    );
  }

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      toast.error('Vui lòng cung cấp địa chỉ giao hàng');
      return;
    }

    setLoading(true);
    try {
      const res = await orderService.createOrder(address);
      if (res.success) {
        if (paymentMethod === 'VNPAY') {
          // Call payment creation
          const paymentRes = await api.get(`/payment/create_payment?orderId=${res.data.id}`);
          if (paymentRes.data?.success) {
            window.location.href = paymentRes.data.data;
            return; // Exit here so we don't clear cart or redirect locally
          } else {
            toast.error('Gặp lỗi khi tạo link VNPAY');
          }
        } else if (paymentMethod === 'VNPAY_MOCK') {
            window.location.href = buildPaymentMockUrl(res.data.id);
            return;
        } else {
          toast.success('Đặt hàng thành công!');
          clearCart();
          navigate('/profile');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Đặt hàng thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center uppercase tracking-widest">Thanh toán an toàn</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Shipping Form */}
        <div className="md:w-2/3">
          <div className="bg-white p-6 border border-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold mb-6">Thông tin giao hàng</h2>
            <form onSubmit={handleCheckout} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ giao hàng</label>
                <textarea
                  required
                  rows="4"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="input-field resize-none"
                  placeholder="Nhập địa chỉ giao hàng chi tiết của bạn (Số nhà/Đường, Phường/Xã, Quận/Huyện, Tỉnh/TP)..."
                />
              </div>

              <div className="pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">Phương thức thanh toán</label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="COD" 
                      checked={paymentMethod === 'COD'} 
                      onChange={() => setPaymentMethod('COD')}
                      className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                    />
                    <div className="ml-3">
                      <span className="block text-sm font-medium text-gray-900">Thanh toán khi nhận hàng (COD)</span>
                      <span className="block text-sm text-gray-500">Thanh toán bằng tiền mặt khi giao hàng</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="VNPAY" 
                      checked={paymentMethod === 'VNPAY'} 
                      onChange={() => setPaymentMethod('VNPAY')}
                      className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                    />
                    <div className="ml-3 flex items-center gap-2">
                      <span className="block text-sm font-medium text-gray-900">Thanh toán qua VNPAY Sandbox (Real API)</span>
                      <img src="https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0oxhzjmxbksr1686814746087.png" alt="VNPay" className="h-4 object-contain" />
                    </div>
                  </label>

                  <label className="flex items-center p-4 border border-blue-100 bg-blue-50/50 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="VNPAY_MOCK" 
                      checked={paymentMethod === 'VNPAY_MOCK'} 
                      onChange={() => setPaymentMethod('VNPAY_MOCK')}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-600"
                    />
                    <div className="ml-3 flex flex-col">
                      <span className="block text-sm font-bold text-blue-900">Test VNPAY Localhost (Giả lập thành công)</span>
                      <span className="block text-xs text-blue-700 mt-1">Dành cho đồ án khi chưa có TmnCode hoặc domain ngrok</span>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-100">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full btn btn-primary py-4 uppercase tracking-widest"
                >
                  {loading ? 'Đang xử lý...' : 'Xác nhận & Đặt hàng'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Order Small Summary */}
        <div className="md:w-1/3">
          <div className="bg-gray-50 p-6 border border-gray-200 rounded-lg sticky top-24">
            <h2 className="font-semibold mb-4 text-sm uppercase tracking-widest text-gray-500">Tổng đơn hàng</h2>
            <div className="space-y-4 mb-6">
              {cartItems.map(item => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate mr-2">{item.quantity}x Product ID</span>
                  <span className="font-medium whitespace-nowrap">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 mt-2 border-t border-dashed border-gray-300">
                <span>Tổng cộng</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

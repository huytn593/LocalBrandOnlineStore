import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle, XCircle } from 'lucide-react';

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    const st = searchParams.get('status');
    const msg = searchParams.get('message');
    const oid = searchParams.get('orderId');

    setStatus(st || 'UNKNOWN');
    setMessage(msg || '');
    setOrderId(oid || '');

    if (st === 'SUCCESS') {
      clearCart();
    }
  }, [searchParams, clearCart]);

  return (
    <div className="max-w-2xl mx-auto py-20 px-4 text-center">
      {status === 'SUCCESS' ? (
        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center">
          <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
          <h1 className="text-3xl font-bold mb-2">Thanh toán thành công!</h1>
          <p className="text-gray-600 mb-2">Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi.</p>
          <p className="text-gray-500 text-sm mb-8">Mã đơn hàng: <span className="font-mono text-black">{orderId}</span></p>
          
          <div className="flex gap-4 w-full justify-center">
            <Link to="/profile" className="btn btn-primary px-8">Xem đơn hàng</Link>
            <Link to="/" className="btn btn-outline px-8">Tiếp tục mua sắm</Link>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center">
          <XCircle className="w-20 h-20 text-red-500 mb-6" />
          <h1 className="text-3xl font-bold mb-2">Thanh toán thất bại</h1>
          <p className="text-gray-600 mb-2">Rất tiếc, giao dịch của bạn không được hoàn tất.</p>
          <p className="text-gray-500 text-sm mb-8">Lý do: <span className="font-medium text-black">{message || 'Đã bị hủy hoặc có lỗi xảy ra'}</span></p>
          
          <div className="flex gap-4 w-full justify-center">
            <Link to="/checkout" className="btn btn-primary px-8">Thử lại</Link>
            <Link to="/" className="btn btn-outline px-8">Về trang chủ</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentResult;

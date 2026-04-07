import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import api from '../api/axios';
import { formatPrice, formatDate } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import { Camera, Package2, ShieldCheck, Mail, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { resolveAssetUrl } from '../utils/api';

const Profile = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await orderService.getMyOrders();
      if (res.success) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error('Failed fetching orders', err);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    PENDING: 'bg-yellow-50 text-yellow-700 border border-yellow-100',
    CONFIRMED: 'bg-blue-50 text-blue-700 border border-blue-100',
    SHIPPED: 'bg-purple-50 text-purple-700 border border-purple-100',
    DELIVERED: 'bg-green-50 text-green-700 border border-green-100',
    CANCELLED: 'bg-red-50 text-red-700 border border-red-100'
  };

  const statusTranslations = {
    PENDING: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    SHIPPED: 'Đang giao hàng',
    DELIVERED: 'Đã giao',
    CANCELLED: 'Đã hủy'
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      {/* Profile Header */}
      <div className="bg-white p-8 rounded-2xl border border-gray-100 mb-12 shadow-sm flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-10">
        <div className="relative group">
          <div className="w-32 h-32 bg-gray-50 rounded-full border-2 border-white shadow-md overflow-hidden flex items-center justify-center ring-4 ring-gray-50 transition-all">
            {user?.avatarUrl ? (
              <img src={resolveAssetUrl(user.avatarUrl)} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <img src="/default-avatar.png" alt={user?.name || 'User'} className="w-full h-full object-cover" />
            )}
          </div>
        </div>

        <div className="flex-grow text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2 justify-center md:justify-start">
            <h1 className="text-3xl font-black tracking-tight">{user?.name}</h1>
            
            {user?.role === 'ADMIN' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-black text-white uppercase tracking-widest">
                <ShieldCheck size={12} className="mr-1" /> Admin
              </span>
            )}
          </div>
          
          <div className="flex flex-col space-y-2 text-gray-500 mb-6 font-medium">
             <div className="flex items-center justify-center md:justify-start gap-2">
                <Mail size={16} /> <span>{user?.email}</span>
             </div>
             <div className="flex items-center justify-center md:justify-start gap-2">
                <UserIcon size={16} /> <span>Thành viên từ {formatDate(user?.createdAt)}</span>
             </div>
          </div>

          <div className="flex gap-4 justify-center md:justify-start">
             <div className="bg-gray-50 px-6 py-3 rounded-xl border border-gray-100">
                <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Đơn hàng</span>
                <span className="text-xl font-black">{orders.length}</span>
             </div>
             <div className="bg-gray-50 px-6 py-3 rounded-xl border border-gray-100">
                <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Cài đặt</span>
                <Link to="/profile/edit" className="text-sm font-bold text-black group flex items-center hover:underline">
                   Chỉnh sửa hồ sơ
                </Link>
             </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div>
        <h2 className="text-xl font-bold mb-6">Lịch sử đơn hàng</h2>
        
        {orders.length === 0 ? (
          <div className="bg-white p-8 border border-gray-200 rounded-lg text-center text-gray-500">
            Bạn chưa có đơn hàng nào.
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 gap-4">
                   <div>
                     <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Ngày đặt</p>
                     <p className="font-medium">{formatDate(order.createdAt)}</p>
                   </div>
                   <div>
                     <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Tổng cộng</p>
                     <p className="font-bold">{formatPrice(order.totalPrice)}</p>
                   </div>
                   <div className="sm:text-right">
                     <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Trạng thái</p>
                     <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status]}`}>
                       {statusTranslations[order.status] || order.status}
                     </span>
                   </div>
                </div>
                
                <div className="p-6">
                  <h4 className="font-semibold text-sm mb-4 border-b border-gray-100 pb-2">Địa chỉ giao hàng:</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-line mb-6 bg-gray-50 p-3 rounded">
                    {order.shippingAddress}
                  </p>
                  
                  <h4 className="font-semibold text-sm mb-4 border-b border-gray-100 pb-2">Sản phẩm:</h4>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                         <div className="flex items-center">
                            <span className="font-medium mr-2">{item.quantity}x</span> 
                            <span className="text-gray-600">Product ID: {item.productId}</span>
                         </div>
                         <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

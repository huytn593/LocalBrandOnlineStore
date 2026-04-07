import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Camera, ChevronLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { resolveAssetUrl } from '../utils/api';

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [uploading, setUploading] = useState(false);
  const [editName, setEditName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
    }
  }, [user]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    setUploading(true);
    try {
      const res = await api.put('/users/avatar', formData);
      if (res.data.success) {
        const newAvatarUrl = res.data.data;
        updateUser({ ...user, avatarUrl: newAvatarUrl });
        toast.success('Cập nhật ảnh đại diện thành công');
      }
    } catch (err) {
      toast.error('Lỗi khi tải ảnh lên');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error('Tên không được để trống!');
      return;
    }
    setSavingProfile(true);
    try {
      const res = await api.put('/users/profile', { name: editName });
      if (res.data.success) {
        updateUser({ ...user, name: editName });
        toast.success('Lưu thông tin thành công');
        navigate('/profile');
      }
    } catch (err) {
      toast.error('Lỗi khi cập nhật hồ sơ');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <button 
        onClick={() => navigate('/profile')} 
        className="flex items-center text-sm font-semibold text-gray-500 hover:text-black transition mb-8"
      >
        <ChevronLeft size={16} className="mr-1" /> Quay lại Hồ sơ
      </button>

      <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight mb-8">Chỉnh sửa hồ sơ</h1>
        
        <div className="flex flex-col md:flex-row gap-12">
          {/* Avatar Area */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
              <div className="w-40 h-40 bg-gray-50 rounded-full border-4 border-white shadow-xl overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105">
                {user?.avatarUrl ? (
                  <img src={resolveAssetUrl(user.avatarUrl)} alt={user?.name} className="w-full h-full object-cover" />
                ) : (
                  <img src="/default-avatar.png" alt={user?.name || 'User'} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="absolute bottom-2 right-2 bg-black text-white p-3 rounded-full shadow-lg transition-transform group-hover:scale-110 border-2 border-white">
                <Camera size={20} />
              </div>
              {uploading && (
                 <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                 </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleAvatarChange} 
                disabled={uploading}
              />
            </div>
            <p className="text-sm font-medium text-gray-400">Nhấp để thay đổi ảnh</p>
          </div>

          {/* Form Area */}
          <form className="flex-grow space-y-6" onSubmit={handleSaveProfile}>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Họ và tên</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all font-semibold"
                placeholder="Nhập tên của bạn"
                disabled={savingProfile}
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email đăng nhập</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 font-semibold cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-2">* Email không thể thay đổi</p>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={savingProfile}
                className="w-full bg-black text-white py-4 px-6 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-gray-900 transition-colors disabled:opacity-70"
              >
                {savingProfile ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>Lưu thay đổi</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;

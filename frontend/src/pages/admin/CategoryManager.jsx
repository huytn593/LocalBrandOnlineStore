import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Pencil, Trash2, Plus, LayoutGrid } from 'lucide-react';
import toast from 'react-hot-toast';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ id: null, name: '', description: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      toast.error('Không thể tải danh mục');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (category = null) => {
    if (category) {
      setIsEditing(true);
      setCurrentCategory({ ...category });
    } else {
      setIsEditing(false);
      setCurrentCategory({ id: null, name: '', description: '' });
    }
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/admin/categories/${currentCategory.id}`, currentCategory);
        toast.success('Cập nhật danh mục thành công');
      } else {
        await api.post('/admin/categories', currentCategory);
        toast.success('Thêm danh mục thành công');
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Thao tác thất bại');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này? Hệ thống sẽ không cho phép nếu có sản phẩm thuộc danh mục này.')) {
      try {
        await api.delete(`/admin/categories/${id}`);
        toast.success('Xóa danh mục thành công');
        fetchCategories();
      } catch (err) {
        toast.error('Không thể xóa danh mục (có thể đang chứa sản phẩm)');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản lý danh mục</h2>
        <button onClick={() => openModal()} className="btn btn-primary flex items-center">
          <Plus size={18} className="mr-2" /> Thêm danh mục
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên danh mục</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="3" className="text-center py-4">Đang tải...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan="3" className="text-center py-8 text-gray-500">Chưa có danh mục nào.</td></tr>
            ) : categories.map(category => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <LayoutGrid size={18} className="mr-3 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{category.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">{category.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openModal(category)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-6">{isEditing ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục</label>
                <input 
                  type="text" 
                  required 
                  value={currentCategory.name} 
                  onChange={e => setCurrentCategory({...currentCategory, name: e.target.value})} 
                  className="input-field" 
                  placeholder="VD: T-Shirts, Hoodies..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea 
                  rows="3" 
                  value={currentCategory.description} 
                  onChange={e => setCurrentCategory({...currentCategory, description: e.target.value})} 
                  className="input-field resize-none"
                  placeholder="Mô tả ngắn về sản phẩm thuộc danh mục này..."
                />
              </div>
              <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowModal(false)} className="btn bg-gray-200 hover:bg-gray-300 text-black px-6">
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary px-8">
                  {isEditing ? 'Lưu thay đổi' : 'Lưu danh mục'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;

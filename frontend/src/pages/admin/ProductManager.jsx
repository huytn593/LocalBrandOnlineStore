import { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import api from '../../api/axios';
import { formatPriceInput, parsePriceInput, displayVNPrice } from '../../utils/priceFormatter';
import { Pencil, Trash2, Plus, Image as ImageIcon, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { resolveAssetUrl } from '../../utils/api';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    id: null, name: '', description: '', price: 0, stock: 0, categoryId: '', images: []
  });
  const [formattedPrice, setFormattedPrice] = useState('0');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        productService.getProducts({ limit: 100 }),
        api.get('/categories')
      ]);
      if (prodRes.success) setProducts(prodRes.data.content);
      if (catRes.data.success) setCategories(catRes.data.data);
    } catch (err) {
      toast.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setIsEditing(true);
      setCurrentProduct({ ...product });
      setFormattedPrice(formatPriceInput(product.price));
    } else {
      setIsEditing(false);
      setCurrentProduct({
        id: null, name: '', description: '', price: 0, stock: 0, categoryId: '', images: []
      });
      setFormattedPrice('0');
    }
    setShowModal(true);
  };

  const handlePriceChange = (e) => {
    const val = e.target.value;
    const formatted = formatPriceInput(val);
    setFormattedPrice(formatted);
    setCurrentProduct({ ...currentProduct, price: parsePriceInput(formatted) });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentProduct.categoryId) {
        toast.error("Vui lòng chọn danh mục");
        return;
    }
    if (currentProduct.price <= 0) {
        toast.error("Giá sản phẩm phải lớn hơn 0");
        return;
    }

    try {
      const payload = { ...currentProduct, stock: Number(currentProduct.stock) || 0 };
      if (isEditing) {
        await productService.updateProduct(currentProduct.id, payload);
        toast.success('Cập nhật sản phẩm thành công');
      } else {
        await productService.createProduct(payload);
        toast.success('Thêm sản phẩm thành công');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Thao tác thất bại');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await productService.deleteProduct(id);
        toast.success('Xóa sản phẩm thành công');
        fetchData();
      } catch (err) {
        toast.error('Xóa thất bại');
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await productService.uploadImage(file);
      if (res.success) {
        const imageUrl = res.data;
        setCurrentProduct(prev => ({
          ...prev,
          images: [...(prev.images || []), imageUrl]
        }));
        toast.success('Tải ảnh lên thành công');
      }
    } catch (err) {
      toast.error('Tải ảnh thất bại');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (indexToRemove) => {
      setCurrentProduct(prev => ({
          ...prev,
          images: prev.images.filter((_, idx) => idx !== indexToRemove)
      }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản lý sản phẩm</h2>
        <button data-testid="add-product-btn" onClick={() => openModal()} className="btn btn-primary flex items-center">
          <Plus size={18} className="mr-2" /> Thêm sản phẩm
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-gray-800">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Sản phẩm</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Giá</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Tồn kho</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Danh mục</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="5" className="text-center py-12">Đang tải dữ liệu...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-12 text-gray-500">Chưa có sản phẩm nào.</td></tr>
            ) : products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex-shrink-0 bg-gray-50 rounded border border-gray-100 overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <img className="h-full w-full object-cover" src={resolveAssetUrl(product.images[0], 'products')} alt="" />
                        ) : (
                          <ImageIcon className="h-6 w-6 m-3 text-gray-300" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">{product.name}</div>
                        <div className="text-xs text-gray-400">ID: {product.id.substring(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{displayVNPrice(product.price)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${product.stock > 10 ? 'bg-green-50 text-green-700' : product.stock > 0 ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 rounded text-gray-600 text-xs font-medium">
                      {product.categoryName || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => openModal(product)} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold">{isEditing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-black p-1">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tên sản phẩm</label>
                    <input data-testid="product-name" type="text" required value={currentProduct.name} onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} className="product-input" placeholder="VD: Hoodie Oversize Essential..." />
                    </div>
                    
                    <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Giá niêm yết (₫)</label>
                    <div className="relative">
                      <input 
                        data-testid="product-price"
                        type="text" 
                        required 
                        value={formattedPrice} 
                        onChange={handlePriceChange} 
                        className="product-input pr-12 font-bold" 
                        placeholder="0"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₫</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">Sẽ tự động xóa số 0 ở đầu và thêm dấu chấm ngăn cách.</p>
                    </div>

                    <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Số lượng tồn kho</label>
                    <input data-testid="product-stock" type="text" required value={currentProduct.stock} onChange={e => setCurrentProduct({...currentProduct, stock: e.target.value.replace(/^0+(?=\d)/, '')})} className="product-input" placeholder="0" />
                    </div>

                    <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Danh mục sản phẩm</label>
                    <select required value={currentProduct.categoryId} onChange={e => setCurrentProduct({...currentProduct, categoryId: e.target.value})} className="product-input appearance-none bg-no-repeat bg-[right_1rem_center]" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundSize: '1.25rem'}}>
                        <option value="">Chọn một danh mục</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    </div>

                    <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Mô tả sản phẩm</label>
                    <textarea data-testid="product-description" required rows="4" value={currentProduct.description} onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})} className="product-input resize-none" placeholder="Nhập mô tả chi tiết về chất liệu, form dáng, bảng size..." />
                    </div>
                </div>

                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Bộ sưu tập hình ảnh</label>
                   
                   <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                      {currentProduct.images?.map((img, idx) => (
                         <div key={idx} className="relative aspect-square border border-gray-100 rounded-lg overflow-hidden group">
                            <img src={resolveAssetUrl(img, 'products')} className="w-full h-full object-cover" alt="" />
                            <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                               <X size={14} />
                            </button>
                         </div>
                      ))}
                      
                      <label className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-black hover:bg-gray-50 transition-all group">
                         {uploadingImage ? (
                           <div className="flex flex-col items-center">
                             <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin mb-2"></div>
                             <span className="text-[10px] text-gray-400">Loading...</span>
                           </div>
                         ) : (
                           <>
                             <Plus className="text-gray-300 group-hover:text-black transition-colors" />
                             <span className="text-[10px] text-gray-400 mt-1">Tải ảnh</span>
                           </>
                         )}
                         <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                      </label>
                   </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100 sticky bottom-0 bg-white">
                  <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors">
                    Hủy
                  </button>
                  <button data-testid="submit-product" type="submit" className="px-10 py-2.5 rounded-lg bg-black text-white font-bold hover:bg-gray-900 shadow-lg shadow-black/10 transition-all active:scale-95">
                    {isEditing ? 'Cập nhật sản phẩm' : 'Đăng sản phẩm'}
                  </button>
                </div>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .product-input {
          @apply w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all text-sm;
        }
      `}} />
    </div>
  );
};

export default ProductManager;

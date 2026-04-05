import { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import useDebounce from '../hooks/useDebounce';
import api from '../api/axios'; // direct import just for categories quick fetch

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Filters
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sort, setSort] = useState('createdAt');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [page, debouncedSearch, selectedCategory, sort]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error('Failed fetching categories', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productService.getProducts({
        page,
        limit: 12,
        search: debouncedSearch,
        category: selectedCategory,
        sort
      });
      
      if (res.success) {
        setProducts(res.data.content);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error('Failed fetching products', err);
    } finally {
      setLoading(false);
    }
  };

  // Reset page to 0 if search/category/sort changes
  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, selectedCategory, sort]);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="sticky top-24 bg-white p-6 border border-gray-100 rounded-lg">
          <h2 className="text-lg font-bold mb-4 uppercase tracking-wider">Bộ lọc</h2>
          
          <div className="mb-6">
            <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-widest mb-3">Danh mục</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="category" 
                  checked={selectedCategory === ''} 
                  onChange={() => setSelectedCategory('')} 
                  className="w-4 h-4 text-black border-gray-300 focus:ring-black accent-black"
                />
                <span className={`text-sm transition-colors ${selectedCategory === '' ? 'font-bold text-black' : 'text-gray-500 group-hover:text-black'}`}>Tất cả sản phẩm</span>
              </label>
              {categories.map(cat => (
                <label key={cat.id} className="flex items-center space-x-2 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="category"
                    checked={selectedCategory === cat.id} 
                    onChange={() => setSelectedCategory(cat.id)} 
                    className="w-4 h-4 text-black border-gray-300 focus:ring-black accent-black"
                  />
                  <span className={`text-sm transition-colors ${selectedCategory === cat.id ? 'font-bold text-black' : 'text-gray-500 group-hover:text-black'}`}>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
             <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-widest mb-3">Sắp xếp theo</h3>
             <select 
               value={sort} 
               onChange={(e) => setSort(e.target.value)}
               className="w-full border border-gray-300 rounded p-2 focus:ring-black"
             >
               <option value="createdAt">Hàng mới về</option>
               <option value="price">Giá (Thấp đến Cao)</option>
               <option value="ratingAverage">Đánh giá tốt nhất</option>
             </select>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Tất cả sản phẩm</h1>
          <div className="w-64">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">Không tìm thấy sản phẩm nào phù hợp với bộ lọc.</p>
            <button 
              onClick={() => { setSearchTerm(''); setSelectedCategory(''); }}
              className="mt-4 text-black underline"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

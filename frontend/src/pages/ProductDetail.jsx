import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { reviewService } from '../services/reviewService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice, formatDate } from '../utils/formatters';
import RatingStars from '../components/RatingStars';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchProductDetails();
    // eslint-disable-next-line
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const [prodRes, revRes] = await Promise.all([
        productService.getProductById(id),
        reviewService.getProductReviews(id)
      ]);
      
      if (prodRes.success) setProduct(prodRes.data);
      if (revRes.success) setReviews(revRes.data);
    } catch (err) {
      toast.error('Tải thông tin sản phẩm thất bại');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Vui lòng đăng nhập để đánh giá');
      return;
    }
    
    setSubmittingReview(true);
    try {
      const res = await reviewService.createReview({
        productId: id,
        rating,
        comment
      });
      if (res.success) {
        toast.success('Gửi đánh giá thành công');
        setComment('');
        setRating(5);
        fetchProductDetails(); // Refresh to show new average and review list
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gửi đánh giá thất bại');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!product) return <div className="text-center py-20">Không tìm thấy sản phẩm.</div>;

  const fallbackImage = 'https://via.placeholder.com/600x800?text=No+Image';
  const getImageUrl = (img) => {
    if (!img) return fallbackImage;
    if (img.startsWith('http')) return img;
    return `http://localhost:8080/uploads/products/${img}`;
  };
  const images = product.images?.length > 0 ? product.images : [null];

  return (
    <div className="max-w-7xl mx-auto py-8">
      {/* Product Section */}
      <div className="flex flex-col md:flex-row gap-12">
        {/* Images */}
        <div className="w-full md:w-1/2 flex flex-col-reverse sm:flex-row gap-4">
           {/* Thumbnails */}
           <div className="flex sm:flex-col gap-4 overflow-x-auto sm:overflow-y-auto sm:w-24 shrink-0">
             {images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  className={`border-2 ${activeImage === idx ? 'border-black' : 'border-transparent'} overflow-hidden shrink-0 w-20 h-24`}
                >
                  <img src={getImageUrl(img)} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
             ))}
           </div>
           
           {/* Main Image */}
           <div className="flex-grow bg-gray-100 aspect-[3/4] relative">
              <img 
                src={getImageUrl(images[activeImage])} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
              {product.stock === 0 && (
                <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 font-bold uppercase tracking-widest text-sm">
                  Hết hàng
                </div>
              )}
           </div>
        </div>

        {/* Info */}
        <div className="w-full md:w-1/2 flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center">
              <span className="text-xl font-bold mr-2">{product.ratingAverage.toFixed(1)}</span>
              <RatingStars rating={product.ratingAverage} size={20} />
            </div>
            <a href="#reviews" className="text-gray-500 hover:text-black underline text-sm">
              Xem tất cả {product.ratingCount} đánh giá
            </a>
          </div>

          <p className="text-2xl font-bold text-black mb-6">{formatPrice(product.price)}</p>
          
          <p className="text-gray-700 whitespace-pre-line leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="mb-4">
             <span className="text-sm text-gray-500 block mb-2">Tình trạng: 
               <span className={`ml-2 font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                 {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
               </span>
             </span>
          </div>

          <div className="flex items-center space-x-4 mb-8">
            <div className="flex items-center border border-gray-300 rounded">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100"
              >-</button>
              <span className="px-4 py-2 border-x border-gray-300 font-medium">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                disabled={quantity >= product.stock}
              >+</button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-grow btn btn-primary py-3 flex justify-center uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Thêm vào giỏ
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div id="reviews" className="mt-20 pt-10 border-t border-gray-200">
        <h2 className="text-2xl font-bold mb-8">Đánh giá của khách hàng</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Review Form */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Viết đánh giá</h3>
            {!user ? (
               <p className="text-gray-600">Vui lòng <button onClick={() => navigate('/login')} className="text-black underline font-semibold">Đăng nhập</button> để viết đánh giá. Lưu ý: Bạn cần mua sản phẩm này trước.</p>
            ) : (
              <form onSubmit={submitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đánh giá</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button 
                        key={star} 
                        type="button" 
                        onClick={() => setRating(star)} 
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <svg className={`w-8 h-8 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                  <textarea 
                    required
                    rows="4"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    className="input-field resize-none"
                    placeholder="Chia sẻ cảm nhận của bạn..."
                  />
                </div>
                <button type="submit" disabled={submittingReview} className="w-full btn btn-outline">
                  {submittingReview ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
              </form>
            )}
          </div>

          {/* Review List */}
          <div className="lg:col-span-2 space-y-8">
            {reviews.length === 0 ? (
              <p className="text-gray-500 italic">Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!</p>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="border-b border-gray-100 pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <RatingStars rating={review.rating} />
                    <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                  </div>
                  <p className="font-semibold text-sm mb-2">{review.userId === user?.id ? 'Bạn' : 'Đã mua hàng'}</p>
                  <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

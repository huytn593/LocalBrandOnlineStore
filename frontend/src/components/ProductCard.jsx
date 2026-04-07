import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/formatters';
import RatingStars from './RatingStars';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { resolveAssetUrl } from '../utils/api';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  
  // Use first image if available, else fallback
  const fallbackImage = 'https://via.placeholder.com/400x500?text=No+Image';
  const firstImage = product.images && product.images.length > 0 ? product.images[0] : null;
  const imgUrl = firstImage 
    ? resolveAssetUrl(firstImage, 'products')
    : fallbackImage;

  return (
    <div data-testid="product-card" className="group flex flex-col h-full bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/products/${product.id}`} className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <img 
          src={imgUrl} 
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.stock === 0 && (
          <div className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 font-semibold uppercase tracking-wider">
            Hết hàng
          </div>
        )}
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/products/${product.id}`} className="block">
          <h3 className="text-sm font-medium text-gray-900 truncate mb-1 hover:text-gray-600 transition">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center mb-2">
          <RatingStars rating={product.ratingAverage} size={14} />
          <span className="text-xs text-gray-500 ml-1">({product.ratingCount})</span>
        </div>
        
        <div className="mt-auto flex items-center justify-between">
          <p className="text-base font-semibold text-black">
            {formatPrice(product.price)}
          </p>
          <button 
          data-testid="add-to-cart-btn"
            onClick={(e) => {
              e.preventDefault();
              if (product.stock > 0) addToCart(product, 1);
            }}
            disabled={product.stock === 0}
            className={`p-2 rounded-full transition-colors ${
              product.stock > 0 
                ? 'bg-gray-100 hover:bg-black hover:text-white text-gray-900' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            aria-label="Thêm vào giỏ"
            title="Thêm vào giỏ"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

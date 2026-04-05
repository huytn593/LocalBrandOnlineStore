import { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await cartService.getCart();
      if (res.success && res.data) {
        setCartItems(res.data.items || []);
      }
    } catch (err) {
      console.error('Failed to fetch cart', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity) => {
    if (!isAuthenticated) {
      toast.error('Please login to add to cart');
      return;
    }
    
    try {
      const res = await cartService.addToCart(product.id, quantity, product.price);
      if (res.success) {
        setCartItems(res.data.items);
        toast.success('Added to cart!');
      }
    } catch (err) {
      toast.error('Failed to add to cart');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await cartService.removeFromCart(productId);
      if (res.success) {
        setCartItems(res.data.items);
        toast.success('Removed from cart');
      }
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const updateQuantity = async (productId, quantity, price) => {
    if (quantity < 1) return;
    try {
      const res = await cartService.updateCartItem(productId, quantity, price);
      if (res.success) {
        setCartItems(res.data.items);
      }
    } catch (err) {
      toast.error('Failed to update quantity');
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      fetchCart,
      clearCart,
      cartTotal,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

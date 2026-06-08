import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (user) fetchCart();
    else { setCartCount(0); setCartItems([]); }
  }, [user]);

  async function fetchCart() {
    try {
      const { data } = await api.get('/cart/');
      const items = data.results ?? data;
      setCartItems(items);
      setCartCount(items.reduce((s, i) => s + i.quantity, 0));
    } catch {}
  }

  async function addToCart(productId) {
    if (!user) { alert('Войдите, чтобы добавить товар в корзину'); return; }
    try {
      await api.post('/cart/', { product_id: productId, quantity: 1 });
      await fetchCart();
    } catch {}
  }

  async function removeFromCart(itemId) {
    await api.delete(`/cart/${itemId}/`);
    await fetchCart();
  }

  async function updateQty(itemId, quantity) {
    if (quantity < 1) { await removeFromCart(itemId); return; }
    await api.patch(`/cart/${itemId}/`, { quantity });
    await fetchCart();
  }

  return (
    <CartContext.Provider value={{ cartCount, cartItems, addToCart, removeFromCart, updateQty, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
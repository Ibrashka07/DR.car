import { createContext, useContext, useState } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  // Локальная корзина — только в памяти, в БД не пишем
  const [cartItems, setCartItems] = useState([]);

  function addToCart(product) {
    if (!user) {
      alert('Войдите, чтобы добавить товар в корзину');
      return;
    }
    setCartItems(prev => {
      const exists = prev.find(i => i.product.id === product.id);
      if (exists) {
        return prev.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1, total_price: (i.quantity + 1) * Number(product.price) }
            : i
        );
      }
      return [...prev, {
        id: product.id, // временный id
        product,
        quantity: 1,
        total_price: Number(product.price),
      }];
    });
  }

  function removeFromCart(productId) {
    setCartItems(prev => prev.filter(i => i.product.id !== productId));
  }

  function updateQty(productId, quantity) {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(i =>
        i.product.id === productId
          ? { ...i, quantity, total_price: quantity * Number(i.product.price) }
          : i
      )
    );
  }

  // Записываем все товары в БД только при оформлении заказа
 async function submitOrder() {
  if (!user || cartItems.length === 0) return false;

  // Сначала очищаем корзину и возвращаем true — окно показывается мгновенно
  const itemsToSave = [...cartItems];
  setCartItems([]);

  // Записываем в БД в фоне, не блокируя UI
  Promise.all(
    itemsToSave.map(item =>
      api.post('/cart/', {
        product_id: item.product.id,
        quantity: item.quantity,
      })
    )
  ).catch(() => {
    // Если ошибка — просто логируем, пользователя не беспокоим
    console.error('Ошибка сохранения заказа в БД');
  });

  return true;
}

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartCount, cartItems,
      addToCart, removeFromCart, updateQty, submitOrder,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
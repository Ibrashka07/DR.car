import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isHome = location.pathname === '/';

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 2.5rem',
      height: '64px',
      background: scrolled || !isHome
        ? 'rgba(10,10,10,0.95)'
        : 'linear-gradient(to bottom, rgba(0,0,0,0.65), transparent)',
      backdropFilter: scrolled || !isHome ? 'blur(12px)' : 'none',
      borderBottom: scrolled || !isHome ? '1px solid rgba(255,255,255,0.07)' : 'none',
      transition: 'background 0.3s, border 0.3s',
    }}>

      {/* Левое меню */}
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        {[['/', 'Главная'], ['/services', 'Услуги'], ['/catalog', 'Каталог'], ['/projects', 'Проекты']].map(([path, label]) => (
          <Link key={path} to={path} style={{
            fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.5px',
            color: location.pathname === path ? '#fff' : 'rgba(255,255,255,0.6)',
            textTransform: 'uppercase',
            borderBottom: location.pathname === path ? '1px solid rgba(255,255,255,0.5)' : '1px solid transparent',
            paddingBottom: '2px',
            transition: 'color 0.2s',
          }}>
            {label}
          </Link>
        ))}
      </div>

      {/* Логотип по центру */}
      <Link to="/" style={{
        position: 'absolute', left: '50%', transform: 'translateX(-50%)',
        fontSize: '1.1rem', fontWeight: 700, letterSpacing: '6px',
        color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase',
      }}>
        dr.car
      </Link>

      {/* Правая часть */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {/* Корзина */}
        <Link to="/profile" style={{ position: 'relative', lineHeight: 0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          {cartCount > 0 && (
            <span style={{
              position: 'absolute', top: -6, right: -8,
              background: 'white', color: '#000',
              borderRadius: '50%', width: 16, height: 16,
              fontSize: '0.65rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          )}
        </Link>

        {/* Личный кабинет */}
        {user ? (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link to="/profile" style={btnStyle}>Кабинет</Link>
            <button onClick={() => { logout(); navigate('/'); }} style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
              fontSize: '0.8rem', cursor: 'pointer', letterSpacing: '0.5px',
            }}>
              Выйти
            </button>
          </div>
        ) : (
          <Link to="/login" style={btnStyle}>Личный кабинет</Link>
        )}
      </div>
    </nav>
  );
}

const btnStyle = {
  padding: '0.45rem 1.1rem',
  border: '1px solid rgba(255,255,255,0.25)',
  borderRadius: '6px',
  fontSize: '0.8rem',
  fontWeight: 500,
  letterSpacing: '0.5px',
  color: 'white',
  textTransform: 'uppercase',
  transition: 'border-color 0.2s',
};
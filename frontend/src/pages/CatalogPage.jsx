import { useState, useEffect } from 'react';
import api from '../services/api';
import { useCart } from '../contexts/CartContext';
import { mediaUrl } from '../utils/media';

export default function CatalogPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [added, setAdded] = useState({});

  useEffect(() => {
    api.get('/product-categories/').then(r => setCategories(r.data.results ?? r.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    api.get(`/products/?${params}`).then(r => {
      let items = r.data.results ?? r.data;
      if (selected.length > 0) {
        items = items.filter(p => selected.includes(p.category));
      }
      setProducts(items);
    }).finally(() => setLoading(false));
  }, [search, selected]);

  function toggleCategory(id) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  }

  function handleAddToCart(product) {
    addToCart(product);
    setAdded(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [product.id]: false })), 1500);
  }

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', background: '#0a0a0a' }}>
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '3rem 2rem' }}>
        <h1 style={{
          fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700,
          textTransform: 'uppercase', marginBottom: '0.5rem',
        }}>
          Каталог товаров
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '3rem' }}>
          Оригинальные запчасти и аксессуары для тюнинга
        </p>

        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-start' }}>

          {/* ── Фильтры ── */}
          <aside style={{
            width: 220, flexShrink: 0,
            background: '#111', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '12px', padding: '1.5rem',
            position: 'sticky', top: 80,
          }}>
            <p style={{
              fontWeight: 600, fontSize: '0.85rem', letterSpacing: '1px',
              textTransform: 'uppercase', marginBottom: '1.25rem',
              color: 'rgba(255,255,255,0.6)',
            }}>
              Категории
            </p>
            {categories.map(cat => (
              <label key={cat.id} style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                marginBottom: '0.75rem', cursor: 'pointer', fontSize: '0.9rem',
                color: selected.includes(cat.id) ? 'white' : 'rgba(255,255,255,0.55)',
              }}>
                <input
                  type="checkbox"
                  checked={selected.includes(cat.id)}
                  onChange={() => toggleCategory(cat.id)}
                  style={{ accentColor: 'white', width: 14, height: 14 }}
                />
                {cat.title}
              </label>
            ))}
            {selected.length > 0 && (
              <button onClick={() => setSelected([])} style={{
                marginTop: '1rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)',
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              }}>
                Сбросить фильтры
              </button>
            )}
          </aside>

          {/* ── Товары ── */}
          <div style={{ flex: 1 }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск по названию, бренду..."
              style={{
                width: '100%', padding: '0.75rem 1rem', marginBottom: '1.5rem',
                background: '#111', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px', color: 'white', fontSize: '0.95rem',
              }}
            />

            {loading ? (
              <p style={{ color: 'rgba(255,255,255,0.3)' }}>Загрузка...</p>
            ) : products.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.3)' }}>Товары не найдены</p>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.25rem',
              }}>
                {products.map(p => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onAddToCart={() => handleAddToCart(p)}
                    justAdded={!!added[p.id]}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product: p, onAddToCart, justAdded }) {
  const BADGE_COLORS  = { hit: '#f59e0b', new: '#10b981', sale: '#ef4444' };
  const BADGE_LABELS  = { hit: 'Хит',     new: 'Новинка', sale: 'Акция'  };

  return (
    <div style={{
      background: '#111', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '12px', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      transition: 'border-color 0.2s, transform 0.2s',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
        e.currentTarget.style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Фото */}
      <div style={{ position: 'relative', height: 200, background: '#1a1a1a' }}>
        {p.photo
          ? <img
              src={mediaUrl(p.photo)}
              alt={p.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          : <div style={{
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '3rem',
            }}>🔧</div>
        }
        {p.badge && (
          <span style={{
            position: 'absolute', top: 10, left: 10,
            background: BADGE_COLORS[p.badge] ?? '#555',
            color: '#fff', fontSize: '0.7rem', fontWeight: 700,
            padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.5px',
          }}>
            {BADGE_LABELS[p.badge] ?? p.badge}
          </span>
        )}
      </div>

      {/* Контент */}
      <div style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {p.brand && (
          <p style={{
            fontSize: '0.72rem', letterSpacing: '1px',
            color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '0.3rem',
          }}>
            {p.brand}
          </p>
        )}
        <p style={{ fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.3, marginBottom: '0.75rem', flex: 1 }}>
          {p.title}
        </p>

        {/* Цена */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>
            {Number(p.price).toLocaleString('ru-RU')} ₽
          </span>
          {p.old_price && (
            <span style={{
              fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.3)',
              textDecoration: 'line-through',
            }}>
              {Number(p.old_price).toLocaleString('ru-RU')} ₽
            </span>
          )}
        </div>

        {/* Кнопка */}
        <button
          onClick={onAddToCart}
          style={{
            width: '100%', padding: '0.65rem',
            background: justAdded ? '#1a1a1a' : 'white',
            color: justAdded ? 'rgba(255,255,255,0.6)' : '#000',
            border: justAdded ? '1px solid rgba(255,255,255,0.1)' : 'none',
            borderRadius: '7px', fontWeight: 600, fontSize: '0.85rem',
            cursor: 'pointer', transition: 'all 0.2s',
          }}
        >
          {justAdded ? '✓ В корзине' : 'В корзину'}
        </button>
      </div>
    </div>
  );
}
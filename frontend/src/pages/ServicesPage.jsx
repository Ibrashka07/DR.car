import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { mediaUrl } from '../utils/media';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories/').then(r => setCategories(r.data.results ?? r.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    api.get(`/services/?${params}`).then(r => {
      let items = r.data.results ?? r.data;
      if (selectedCat) items = items.filter(s => s.category_title === selectedCat);
      setServices(items);
    }).finally(() => setLoading(false));
  }, [search, selectedCat]);

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', background: '#0a0a0a' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 2rem' }}>
        <p style={{
          fontSize: '0.75rem', letterSpacing: '3px',
          color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: '0.75rem',
        }}>
          Что мы делаем
        </p>
        <h1 style={{
          fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700,
          textTransform: 'uppercase', marginBottom: '0.5rem',
        }}>
          Услуги тюнинга
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '2.5rem' }}>
          Профессиональная кастомизация любой сложности
        </p>

        {/* Фильтры */}
        <div style={{
          display: 'flex', gap: '0.75rem', flexWrap: 'wrap',
          marginBottom: '2rem', alignItems: 'center',
        }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск услуги..."
            style={{
              padding: '0.6rem 1rem', background: '#111',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px',
              color: 'white', fontSize: '0.9rem', minWidth: 220,
            }}
          />
          <button onClick={() => setSelectedCat(null)} style={filterBtn(!selectedCat)}>
            Все
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.title)}
              style={filterBtn(selectedCat === c.title)}
            >
              {c.title}
            </button>
          ))}
        </div>

        {/* Сетка */}
        {loading ? (
          <p style={{ color: 'rgba(255,255,255,0.3)' }}>Загрузка...</p>
        ) : services.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.3)' }}>Услуги не найдены</p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}>
            {services.map(item => (
              <Link
                key={item.id}
                to={`/services/${item.id}`}
                style={{
                  display: 'block', background: '#111',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '12px', overflow: 'hidden',
                  transition: 'border-color 0.2s, transform 0.2s',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ height: 200, background: '#1a1a1a', overflow: 'hidden' }}>
                  {item.photo
                    ? <img
                        src={mediaUrl(item.photo)}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    : <div style={{
                        width: '100%', height: '100%',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '3rem',
                      }}>🔧</div>
                  }
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <p style={{
                    fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)',
                    letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.4rem',
                  }}>
                    {item.category_title}
                  </p>
                  <h3 style={{
                    fontWeight: 700, fontSize: '1rem',
                    marginBottom: '0.75rem', lineHeight: 1.3,
                  }}>
                    {item.title}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                      {Number(item.price).toLocaleString('ru-RU')} ₽
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem' }}>
                      {item.duration_days} дн.
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const filterBtn = active => ({
  padding: '0.45rem 1.1rem', borderRadius: '20px', cursor: 'pointer',
  border: '1px solid rgba(255,255,255,0.15)',
  background: active ? 'white' : 'transparent',
  color: active ? '#000' : 'rgba(255,255,255,0.6)',
  fontWeight: 500, fontSize: '0.85rem', transition: 'all 0.2s',
});
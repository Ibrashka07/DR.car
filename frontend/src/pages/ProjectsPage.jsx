import { useState, useEffect } from 'react';
import api from '../services/api';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  useEffect(() => {
    api.get('/projects/').then(r => setProjects(r.data.results ?? r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 2rem' }}>
        <p style={{ fontSize: '0.75rem', letterSpacing: '3px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          Портфолио
        </p>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          Наши проекты
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '3rem' }}>
          Автомобили, которые прошли через наши руки
        </p>

        {loading ? (
          <p style={{ color: 'rgba(255,255,255,0.3)' }}>Загрузка...</p>
        ) : projects.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.3)' }}>Проекты скоро появятся</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {projects.map(p => (
              <div key={p.id}
                onClick={() => setActive(p)}
                style={{
                  background: '#111', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
                  transition: 'border-color 0.2s, transform 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ height: 240, background: '#1a1a1a', overflow: 'hidden' }}>
                  {p.photo_main
                    ? <img src={`http://127.0.0.1:8000${p.photo_main}`} alt={p.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>🚗</div>
                  }
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    {p.car_make} {p.car_model} · {p.car_year}
                  </p>
                  <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{p.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', lineHeight: 1.6,
                    overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {p.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Модалка */}
      {active && (
        <div onClick={() => setActive(null)} style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#111', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px', maxWidth: 800, width: '100%', maxHeight: '90vh', overflowY: 'auto',
          }}>
            {active.photo_main && (
              <img src={`http://127.0.0.1:8000${active.photo_main}`} alt=""
                style={{ width: '100%', height: 350, objectFit: 'cover', borderRadius: '16px 16px 0 0' }} />
            )}
            <div style={{ padding: '2rem' }}>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                {active.car_make} {active.car_model} · {active.car_year}
              </p>
              <h2 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: '1rem' }}>{active.title}</h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, marginBottom: '1.5rem' }}>{active.description}</p>

              {(active.photo_before || active.photo_after) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {active.photo_before && (
                    <div>
                      <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>До</p>
                      <img src={`http://127.0.0.1:8000${active.photo_before}`} alt="До"
                        style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: '8px' }} />
                    </div>
                  )}
                  {active.photo_after && (
                    <div>
                      <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>После</p>
                      <img src={`http://127.0.0.1:8000${active.photo_after}`} alt="После"
                        style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: '8px' }} />
                    </div>
                  )}
                </div>
              )}

              <button onClick={() => setActive(null)} style={{
                marginTop: '1.5rem', padding: '0.75rem 2rem',
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px', color: 'white', cursor: 'pointer', fontWeight: 500,
              }}>
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
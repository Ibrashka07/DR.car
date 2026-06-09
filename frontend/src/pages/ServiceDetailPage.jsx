import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { mediaUrl } from '../utils/media';
import api from '../services/api';

export default function ServiceDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.post(`/services/${id}/increment_views/`).catch(() => {}),
      api.get(`/services/${id}/`),
      api.get(`/services/${id}/comments/`),
    ]).then(([, svc, cmts]) => {
      setService(svc.data);
      setComments(Array.isArray(cmts.data) ? cmts.data : (cmts.data.results ?? []));
    }).finally(() => setLoading(false));
  }, [id]);

  async function submitComment(e) {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const { data } = await api.post(`/services/${id}/comments/`, { text: commentText });
      setComments(prev => [data, ...prev]);
      setCommentText('');
    } catch {
      alert('Ошибка отправки комментария');
    }
  }

  if (loading) return (
    <div style={{
      paddingTop: '120px', textAlign: 'center',
      color: 'rgba(255,255,255,0.4)', background: '#0a0a0a',
      minHeight: '100vh',
    }}>
      Загрузка...
    </div>
  );

  if (!service) return (
    <div style={{
      paddingTop: '120px', textAlign: 'center',
      color: 'rgba(255,255,255,0.4)', background: '#0a0a0a',
      minHeight: '100vh',
    }}>
      Услуга не найдена
    </div>
  );

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', background: '#0a0a0a' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem 5rem' }}>

        {/* Фото */}
        {service.photo ? (
          <div style={{
            width: '100%', height: 420, borderRadius: '16px',
            overflow: 'hidden', marginBottom: '2rem', background: '#111',
          }}>
            <img
              src={mediaUrl(service.photo)}
              alt={service.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
        ) : (
          <div style={{
            width: '100%', height: 420, borderRadius: '16px',
            background: '#111', marginBottom: '2rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '5rem', border: '1px solid rgba(255,255,255,0.07)',
          }}>
            🔧
          </div>
        )}

        {/* Категория */}
        <p style={{
          color: 'rgba(255,255,255,0.35)', letterSpacing: '2px',
          textTransform: 'uppercase', fontSize: '0.75rem', marginBottom: '0.5rem',
        }}>
          {service.category?.title}
        </p>

        {/* Заголовок */}
        <h1 style={{
          fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 700,
          lineHeight: 1.2, marginBottom: '2rem', letterSpacing: '-0.02em',
        }}>
          {service.title}
        </h1>

        {/* Метрики */}
        <div style={{
          display: 'flex', gap: '2.5rem', marginBottom: '2.5rem',
          flexWrap: 'wrap', padding: '1.5rem',
          background: '#111', borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
              Стоимость
            </p>
            <p style={{ fontSize: '1.75rem', fontWeight: 700 }}>
              {Number(service.price).toLocaleString('ru-RU')} ₽
            </p>
          </div>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
              Срок
            </p>
            <p style={{ fontSize: '1.75rem', fontWeight: 700 }}>
              {service.duration_days} дн.
            </p>
          </div>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
              Просмотры
            </p>
            <p style={{ fontSize: '1.75rem', fontWeight: 700 }}>
              {service.views}
            </p>
          </div>
          {service.author && (
            <div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                Автор
              </p>
              <p style={{ fontSize: '1rem', fontWeight: 600 }}>
                {service.author}
              </p>
            </div>
          )}
        </div>

        {/* Описание */}
        <div style={{
          lineHeight: 1.9, color: 'rgba(255,255,255,0.75)',
          fontSize: '1.05rem', marginBottom: '3.5rem',
          padding: '1.5rem', background: '#111', borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.07)',
          whiteSpace: 'pre-wrap',
        }}>
          {service.content}
        </div>

        {/* Комментарии */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          Комментарии ({comments.length})
        </h2>

        {user ? (
          <form onSubmit={submitComment} style={{ marginBottom: '2rem' }}>
            <textarea
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Ваш комментарий..."
              style={{
                width: '100%', minHeight: 100, padding: '0.75rem 1rem',
                background: '#111', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px', color: 'white', fontSize: '1rem',
                resize: 'vertical',
              }}
            />
            <button type="submit" style={{
              marginTop: '0.75rem', padding: '0.75rem 2rem',
              background: 'white', color: '#000', border: 'none',
              borderRadius: '8px', fontWeight: 600, fontSize: '1rem',
              cursor: 'pointer',
            }}>
              Отправить
            </button>
          </form>
        ) : (
          <div style={{
            padding: '1rem 1.5rem', marginBottom: '2rem',
            background: '#111', borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.07)',
            color: 'rgba(255,255,255,0.4)', fontSize: '0.95rem',
          }}>
            Войдите, чтобы оставить комментарий.
          </div>
        )}

        {comments.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.3)' }}>
            Комментариев пока нет. Будьте первым!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {comments.map(c => (
              <div key={c.id} style={{
                padding: '1.25rem', background: '#111', borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: '0.6rem',
                }}>
                  <strong style={{ fontSize: '0.95rem' }}>{c.author_name}</strong>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
                    {new Date(c.created_at).toLocaleDateString('ru-RU', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                    })}
                  </span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                  {c.text}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
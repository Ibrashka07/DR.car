import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
      setComments(cmts.data);
    }).finally(() => setLoading(false));
  }, [id]);

  async function submitComment(e) {
    e.preventDefault();
    if (!commentText.trim()) return;
    const { data } = await api.post(`/services/${id}/comments/`, { text: commentText });
    setComments(prev => [data, ...prev]);
    setCommentText('');
  }

  if (loading) return (
    <div style={{ paddingTop: '120px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
      Загрузка...
    </div>
  );
  if (!service) return null;

  return (
    <div style={{ paddingTop: '100px', maxWidth: '900px', margin: '0 auto', padding: '100px 2rem 4rem' }}>
      {service.photo && (
        <img src={`http://127.0.0.1:8000${service.photo}`} alt={service.title}
          style={{ width: '100%', height: 400, objectFit: 'cover', borderRadius: '12px', marginBottom: '2rem' }} />
      )}

      <p style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.8rem' }}>
        {service.category?.title}
      </p>

      <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 700, margin: '0.5rem 0 1.5rem', lineHeight: 1.2 }}>
        {service.title}
      </h1>

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>Стоимость</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 700 }}>
            {Number(service.price).toLocaleString('ru-RU')} ₽
          </p>
        </div>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>Срок</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 700 }}>{service.duration_days} дн.</p>
        </div>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>Просмотры</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 700 }}>{service.views}</p>
        </div>
      </div>

      <p style={{ lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', marginBottom: '3rem' }}>
        {service.content}
      </p>

      {/* Comments */}
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
        Комментарии ({comments.length})
      </h2>

      {user ? (
        <form onSubmit={submitComment} style={{ marginBottom: '2rem' }}>
          <textarea value={commentText} onChange={e => setCommentText(e.target.value)}
            placeholder="Ваш комментарий..."
            style={{
              width: '100%', minHeight: 100, padding: '0.75rem 1rem',
              background: '#111', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px', color: 'white', fontSize: '1rem', resize: 'vertical',
            }} />
          <button type="submit" style={{
            marginTop: '0.75rem', padding: '0.75rem 2rem',
            background: 'white', color: '#000', border: 'none', borderRadius: '8px',
            fontWeight: 600, fontSize: '1rem', cursor: 'pointer',
          }}>
            Отправить
          </button>
        </form>
      ) : (
        <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '2rem' }}>
          Войдите, чтобы оставить комментарий.
        </p>
      )}

      {comments.map(c => (
        <div key={c.id} style={{
          padding: '1rem', marginBottom: '1rem',
          background: '#111', borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <strong>{c.author_name}</strong>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>
              {new Date(c.created_at).toLocaleDateString('ru-RU')}
            </span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>{c.text}</p>
        </div>
      ))}
    </div>
  );
}
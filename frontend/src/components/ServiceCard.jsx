import { Link } from 'react-router-dom';
import { mediaUrl } from '../utils/media';

export default function ServiceCard({ service }) {
  return (
    <Link to={`/services/${service.id}`} style={{
      display: 'block', background: '#111', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '12px', overflow: 'hidden',
      transition: 'transform 0.2s, border-color 0.2s',
      textDecoration: 'none',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
      }}
    >
      {/* Photo */}
      <div style={{
        width: '100%', height: 200, background: '#1a1a1a',
        overflow: 'hidden',
      }}>
        {service.photo ? (
          <img src={mediaUrl(service.photo)}
            alt={service.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,0.2)', fontSize: '3rem',
          }}>🚗</div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem' }}>
        <p style={{
          fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)',
          letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem',
        }}>
          {service.category_title}
        </p>
        <h3 style={{
          fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem',
          lineHeight: 1.3,
        }}>
          {service.title}
        </h3>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>
            {Number(service.price).toLocaleString('ru-RU')} ₽
          </span>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
            {service.duration_days} дн.
          </span>
        </div>
      </div>
    </Link>
  );
}
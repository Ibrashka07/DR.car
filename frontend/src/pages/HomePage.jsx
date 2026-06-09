import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from '../components/Slider';
import api from '../services/api';
import { mediaUrl } from '../utils/media';

export default function HomePage() {
  const [reviews, setReviews] = useState([]);
  const [appointmentForm, setAppointmentForm] = useState({
    name: '', phone: '', email: '', service: '', message: '', date: ''
  });
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/reviews/').then(r => {
      const data = r.data.results ?? r.data;
      setReviews(data.slice(0, 4));
    }).catch(() => {});
  }, []);

  async function handleAppointment(e) {
    e.preventDefault();
    try {
      await api.post('/appointments/', appointmentForm);
      setSent(true);
      setAppointmentForm({ name: '', phone: '', email: '', service: '', message: '', date: '' });
    } catch {
      alert('Ошибка отправки. Проверьте данные.');
    }
  }

  const advantages = [
    { icon: '⚡', title: 'Собственный стенд замера мощности', desc: 'Точные данные до и после тюнинга' },
    { icon: '🛡', title: 'Гарантия 2 года на все работы', desc: 'Уверены в качестве каждого этапа' },
    { icon: '🔩', title: 'Оригинальные комплектующие', desc: 'Только проверенные бренды и поставщики' },
    { icon: '📸', title: 'Прозрачный фотоотчёт', desc: 'Фото каждого этапа работы' },
  ];

  return (
    <>
      <Slider />

      {/* ── О НАС ─────────────────────────────────────────── */}
      <section style={{ background: '#0d0d0d', padding: '6rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '0.75rem', letterSpacing: '3px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: '1rem' }}>
              О студии
            </p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
              DR.CAR — студия тюнинга и кастомизации
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.9, marginBottom: '1rem' }}>
              Мы занимаемся профессиональным тюнингом автомобилей с 2015 года. Наша команда — это инженеры и мастера с опытом работы на международных соревнованиях.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.9, marginBottom: '2rem' }}>
              Мы предоставляем полный спектр услуг: от чип-тюнинга и настройки подвески до полной кастомизации кузова и интерьера. Работаем с любыми марками и моделями.
            </p>
            <button onClick={() => navigate('/services')} style={{
              padding: '0.875rem 2rem', background: 'white', color: '#000',
              border: 'none', borderRadius: '8px', fontWeight: 700,
              fontSize: '0.9rem', cursor: 'pointer', letterSpacing: '0.5px',
            }}>
              Наши услуги →
            </button>
          </div>
          <div style={{
            background: '#111', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '16px', padding: '2.5rem', display: 'grid',
            gridTemplateColumns: '1fr 1fr', gap: '1.5rem',
          }}>
            {[['200+', 'Проектов'], ['9', 'Лет опыта'], ['15', 'Мастеров'], ['2 года', 'Гарантия']].map(([num, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.25rem' }}>{num}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ПРЕИМУЩЕСТВА ──────────────────────────────────── */}
      <section style={{ padding: '6rem 2rem', background: var_bg }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={labelStyle}>Почему мы</p>
          <h2 style={sectionTitleStyle}>Наши преимущества</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            {advantages.map(a => (
              <div key={a.title} style={{
                background: '#111', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '12px', padding: '2rem 1.5rem',
                transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>{a.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', lineHeight: 1.3 }}>{a.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ОНЛАЙН-ЗАПИСЬ ─────────────────────────────────── */}
      <section style={{ padding: '6rem 2rem', background: '#0d0d0d' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <p style={labelStyle}>Запись</p>
          <h2 style={{ ...sectionTitleStyle, textAlign: 'center' }}>Записаться онлайн</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: '2.5rem' }}>
            Оставьте заявку — мы свяжемся с вами в течение часа
          </p>

          {sent ? (
            <div style={{
              background: '#111', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '12px', padding: '3rem', textAlign: 'center',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Заявка принята!</h3>
              <p style={{ color: 'rgba(255,255,255,0.4)' }}>Мы свяжемся с вами в ближайшее время.</p>
              <button onClick={() => setSent(false)} style={{ marginTop: '1.5rem', padding: '0.75rem 2rem', background: 'white', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                Новая заявка
              </button>
            </div>
          ) : (
            <form onSubmit={handleAppointment} style={{
              background: '#111', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '16px', padding: '2.5rem',
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem',
            }}>
              {[
                ['Имя *', 'name', 'text'], ['Телефон *', 'phone', 'tel'],
                ['Email', 'email', 'email'], ['Услуга *', 'service', 'text'],
              ].map(([label, field, type]) => (
                <div key={field}>
                  <label style={labelInputStyle}>{label}</label>
                  <input type={type} required={label.includes('*')}
                    value={appointmentForm[field]}
                    onChange={e => setAppointmentForm(f => ({ ...f, [field]: e.target.value }))}
                    style={inputStyle} />
                </div>
              ))}
              <div>
                <label style={labelInputStyle}>Желаемая дата *</label>
                <input type="date" required
                  value={appointmentForm.date}
                  onChange={e => setAppointmentForm(f => ({ ...f, date: e.target.value }))}
                  style={{ ...inputStyle, colorScheme: 'dark' }} />
              </div>
              <div>
                <label style={labelInputStyle}>Комментарий</label>
                <input type="text"
                  value={appointmentForm.message}
                  onChange={e => setAppointmentForm(f => ({ ...f, message: e.target.value }))}
                  style={inputStyle} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <button type="submit" style={{
                  width: '100%', padding: '1rem',
                  background: 'white', color: '#000', border: 'none',
                  borderRadius: '8px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
                }}>
                  Отправить заявку
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ── ОТЗЫВЫ ────────────────────────────────────────── */}
      <section style={{ padding: '6rem 2rem', background: var_bg }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={labelStyle}>Клиенты</p>
          <h2 style={sectionTitleStyle}>Отзывы</h2>
          {reviews.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.3)' }}>Пока нет отзывов</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {reviews.map(r => (
                <div key={r.id} style={{
                  background: '#111', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '12px', padding: '1.75rem',
                }}>
                  {/* Заголовок карточки */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%',
                      background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)',
                      overflow: 'hidden', flexShrink: 0,
                    }}>
                      {r.author_avatar
                        ? <img src={mediaUrl(r.author_avatar)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>👤</div>
                      }
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{r.author_name}</p>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{r.car_model}</p>
                    </div>
                  </div>
                  {/* Звёзды */}
                  <div style={{ marginBottom: '0.75rem' }}>
                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', lineHeight: 1.7 }}>{r.text}</p>
                  {r.photo && (
                    <img src={mediaUrl(r.photo)} alt=""
                      style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: '8px', marginTop: '1rem' }} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

const var_bg = '#0a0a0a';
const labelStyle = { fontSize: '0.75rem', letterSpacing: '3px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: '0.75rem' };
const sectionTitleStyle = { fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: '2.5rem' };
const labelInputStyle = { display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' };
const inputStyle = { width: '100%', padding: '0.75rem 1rem', background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: 'white', fontSize: '0.95rem' };
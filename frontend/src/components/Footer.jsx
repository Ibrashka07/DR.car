import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      background: '#0d0d0d',
      borderTop: '1px solid rgba(255,255,255,0.07)',
      padding: '4rem 2rem 2rem',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Верхняя часть */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem',
        }}>
          {/* Логотип + описание */}
          <div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '4px', marginBottom: '1rem' }}>
              DR.CAR
            </div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', lineHeight: 1.7 }}>
              Студия тюнинга и кастомизации автомобилей. Работаем с 2015 года.
            </p>
            {/* Соц. сети */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              {[
                { label: 'VK', href: '#' },
                { label: 'TG', href: '#' },
                { label: 'IG', href: '#' },
              ].map(s => (
                <a key={s.label} href={s.href} style={{
                  width: 36, height: 36, border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700,
                  color: 'rgba(255,255,255,0.5)',
                  transition: 'border-color 0.2s, color 0.2s',
                }}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Навигация */}
          <div>
            <p style={{ fontWeight: 600, marginBottom: '1rem', fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Навигация
            </p>
            {[['/', 'Главная'], ['/services', 'Услуги'], ['/catalog', 'Каталог'], ['/projects', 'Проекты']].map(([path, label]) => (
              <Link key={path} to={path} style={{
                display: 'block', color: 'rgba(255,255,255,0.4)',
                marginBottom: '0.6rem', fontSize: '0.9rem',
                transition: 'color 0.2s',
              }}>
                {label}
              </Link>
            ))}
          </div>

          {/* Контакты */}
          <div>
            <p style={{ fontWeight: 600, marginBottom: '1rem', fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Контакты
            </p>
            {[
              ['📍', 'г. Ставрополь, ул. Примерная, 42'],
              ['📞', '+7 (900) 000-00-01'],
              ['📞', '+7 (900) 000-00-02'],
              ['✉️', 'info@drcar.ru'],
            ].map(([icon, text]) => (
              <p key={text} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', marginBottom: '0.6rem' }}>
                {icon} {text}
              </p>
            ))}
          </div>

          {/* Режим работы */}
          <div>
            <p style={{ fontWeight: 600, marginBottom: '1rem', fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Режим работы
            </p>
            {[
              ['Пн — Пт', '9:00 — 20:00'],
              ['Суббота', '10:00 — 18:00'],
              ['Воскресенье', 'Выходной'],
            ].map(([day, time]) => (
              <div key={day} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', maxWidth: 200 }}>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>{day}</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>{time}</span>
              </div>
            ))}

            {/* Карта */}
            <div style={{
              marginTop: '1.5rem',
              background: '#1a1a1a',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.4)',
            }}>
              📍 <a href="https://yandex.ru/maps" target="_blank" rel="noreferrer"
                style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'underline' }}>
                Открыть на карте
              </a>
            </div>
          </div>
        </div>

        {/* Нижняя строка */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.07)',
          paddingTop: '1.5rem',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem' }}>
            © 2015–2026 DR.CAR. Все права защищены.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem' }}>
            Студия тюнинга автомобилей
          </p>
        </div>
      </div>
    </footer>
  );
}
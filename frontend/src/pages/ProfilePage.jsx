import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { mediaUrl } from '../utils/media';
import api from '../services/api';

const STATUS_CONFIG = {
  waiting_parts: { label: 'Ожидает запчасти',   color: '#f59e0b', icon: '⏳' },
  on_lift:       { label: 'На подъёмнике',       color: '#3b82f6', icon: '🔧' },
  painting:      { label: 'На участке покраски', color: '#8b5cf6', icon: '🎨' },
  ready:         { label: 'Готов к выдаче',      color: '#10b981', icon: '✅' },
  done:          { label: 'Выдан',               color: '#6b7280', icon: '🏁' },
};

export default function ProfilePage() {
  const { user, fetchProfile } = useAuth();
  const { cartItems, removeFromCart, updateQty, submitOrder } = useCart();

  const [tab, setTab] = useState('cars');
  const [cars, setCars] = useState([]);
  const [orderDone, setOrderDone] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name:  user?.last_name  || '',
    email:      user?.email      || '',
    bio:        user?.bio        || '',
    phone:      user?.phone      || '',
  });

  useEffect(() => {
    api.get('/my-cars/')
      .then(r => setCars(r.data.results ?? r.data))
      .catch(() => {});
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    await api.patch('/auth/profile/', form);
    await fetchProfile();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleOrder() {
    const ok = await submitOrder();
    if (ok) setOrderDone(true);
  }

  const cartTotal = cartItems.reduce((s, i) => s + i.total_price, 0);

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', background: '#0a0a0a' }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto', padding: '3rem 2rem',
        display: 'flex', gap: '2.5rem', alignItems: 'flex-start',
      }}>

        {/* ── Левая колонка ─────────────────────────────── */}
        <div style={{ width: 220, flexShrink: 0, position: 'sticky', top: 80 }}>
          <div style={{
            background: '#111', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '16px', padding: '2rem', textAlign: 'center', marginBottom: '1rem',
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)',
              margin: '0 auto 1rem', overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
            }}>
              {user?.avatar
                ? <img src={mediaUrl(user.avatar)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : '👤'
              }
            </div>
            <p style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.25rem' }}>
              {user?.first_name || user?.username}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>
              @{user?.username}
            </p>
          </div>

          {[
            ['cars',     '🚗 Мои авто'],
            ['cart',     `🛒 Корзина (${cartItems.length})`],
            ['settings', '⚙️ Настройки'],
          ].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              display: 'block', width: '100%', textAlign: 'left',
              padding: '0.75rem 1rem', marginBottom: '0.4rem',
              background: tab === id ? '#1a1a1a' : 'transparent',
              border: `1px solid ${tab === id ? 'rgba(255,255,255,0.12)' : 'transparent'}`,
              borderRadius: '8px',
              color: tab === id ? 'white' : 'rgba(255,255,255,0.5)',
              fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.15s',
            }}>
              {label}
            </button>
          ))}
        </div>

        {/* ── Правая колонка ────────────────────────────── */}
        <div style={{ flex: 1 }}>

          {/* МОИ АВТО */}
          {tab === 'cars' && (
            <div>
              <h2 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                Мои автомобили
              </h2>
              {cars.length === 0 ? (
                <div style={{
                  background: '#111', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '12px', padding: '3rem', textAlign: 'center',
                  color: 'rgba(255,255,255,0.3)',
                }}>
                  <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚗</p>
                  <p>У вас пока нет автомобилей в работе</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {cars.map(car => {
                    const cfg = STATUS_CONFIG[car.status] ?? STATUS_CONFIG.waiting_parts;
                    return (
                      <div key={car.id} style={{
                        background: '#111', border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: '12px', padding: '1.5rem',
                        display: 'flex', gap: '1.5rem', alignItems: 'center',
                      }}>
                        {car.photo
                          ? <img src={mediaUrl(car.photo)} alt=""
                              style={{ width: 100, height: 70, objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
                          : <div style={{
                              width: 100, height: 70, background: '#1a1a1a', borderRadius: '8px',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '2rem', flexShrink: 0,
                            }}>🚗</div>
                        }
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 700, fontSize: '1.05rem' }}>
                            {car.make} {car.model} {car.year}
                          </p>
                          {car.license_plate && (
                            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                              {car.license_plate}
                            </p>
                          )}
                          <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.35rem 0.9rem', borderRadius: '20px',
                            background: `${cfg.color}20`, border: `1px solid ${cfg.color}40`,
                          }}>
                            <span>{cfg.icon}</span>
                            <span style={{ color: cfg.color, fontSize: '0.85rem', fontWeight: 600 }}>
                              {cfg.label}
                            </span>
                          </div>
                          {car.status_note && (
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                              {car.status_note}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* КОРЗИНА */}
          {tab === 'cart' && (
            <div>
              <h2 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                Корзина
              </h2>
              {cartItems.length === 0 ? (
                <div style={{
                  background: '#111', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '12px', padding: '3rem', textAlign: 'center',
                  color: 'rgba(255,255,255,0.3)',
                }}>
                  <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>🛒</p>
                  <p>Корзина пуста</p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                    {cartItems.map(item => (
                      <div key={item.id} style={{
                        background: '#111', border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: '12px', padding: '1.25rem',
                        display: 'flex', gap: '1rem', alignItems: 'center',
                      }}>
                        {item.product.photo
                          ? <img src={mediaUrl(item.product.photo)} alt=""
                              style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
                          : <div style={{
                              width: 70, height: 70, background: '#1a1a1a', borderRadius: '8px',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '1.5rem', flexShrink: 0,
                            }}>🔧</div>
                        }
                        <div style={{ flex: 1 }}>
                          {item.product.brand && (
                            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                              {item.product.brand}
                            </p>
                          )}
                          <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.product.title}</p>
                          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                            {Number(item.product.price).toLocaleString('ru-RU')} ₽ × {item.quantity}
                          </p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button onClick={() => updateQty(item.product.id, item.quantity - 1)} style={qtyBtn}>−</button>
                          <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
                          <button onClick={() => updateQty(item.product.id, item.quantity + 1)} style={qtyBtn}>+</button>
                        </div>

                        <div style={{ textAlign: 'right', minWidth: 90 }}>
                          <p style={{ fontWeight: 700 }}>
                            {Number(item.total_price).toLocaleString('ru-RU')} ₽
                          </p>
                          <button onClick={() => removeFromCart(item.product.id)} style={{
                            fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)',
                            background: 'none', border: 'none', cursor: 'pointer', marginTop: '0.25rem',
                          }}>
                            удалить
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Итого + кнопка */}
                  <div style={{
                    background: '#111', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px', padding: '1.5rem',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <div>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>Итого</p>
                      <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                        {Number(cartTotal).toLocaleString('ru-RU')} ₽
                      </p>
                    </div>
                    <button onClick={handleOrder} style={{
                      padding: '0.875rem 2.5rem', background: 'white', color: '#000',
                      border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer',
                    }}>
                      Оформить заказ
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* НАСТРОЙКИ */}
          {tab === 'settings' && (
            <div>
              <h2 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                Настройки профиля
              </h2>
              {saved && (
                <p style={{ color: '#10b981', marginBottom: '1rem' }}>✓ Сохранено</p>
              )}
              <form onSubmit={handleSave} style={{
                background: '#111', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '16px', padding: '2rem',
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem',
              }}>
                {[
                  ['Имя',     'first_name', 'text'],
                  ['Фамилия', 'last_name',  'text'],
                  ['Email',   'email',      'email'],
                  ['Телефон', 'phone',      'text'],
                ].map(([label, field, type]) => (
                  <div key={field}>
                    <label style={labelStyle}>{label}</label>
                    <input
                      type={type}
                      value={form[field]}
                      onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                      style={inputStyle}
                    />
                  </div>
                ))}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>О себе</label>
                  <textarea
                    value={form.bio}
                    onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                    style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <button type="submit" style={{
                    padding: '0.875rem 2.5rem', background: 'white', color: '#000',
                    border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer',
                  }}>
                    Сохранить
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* ── Модалка подтверждения заказа ─────────────────── */}
      {orderDone && (
        <div
          onClick={() => setOrderDone(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#111', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '20px', padding: '3rem 2.5rem',
              maxWidth: 420, width: '100%', textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem' }}>✅</div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.3 }}>
              Спасибо за заказ!
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: '2rem' }}>
              Скоро с вами свяжутся наши сотрудники для подтверждения.
            </p>
            <button
              onClick={() => setOrderDone(false)}
              style={{
                padding: '0.875rem 2.5rem', background: 'white', color: '#000',
                border: 'none', borderRadius: '8px', fontWeight: 700,
                fontSize: '1rem', cursor: 'pointer',
              }}
            >
              Отлично!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const qtyBtn = {
  width: 28, height: 28,
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '6px', background: 'transparent', color: 'white',
  cursor: 'pointer', fontSize: '1rem',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

const labelStyle = {
  display: 'block', marginBottom: '0.4rem',
  fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)',
};

const inputStyle = {
  width: '100%', padding: '0.75rem 1rem',
  background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '8px', color: 'white', fontSize: '0.95rem',
};
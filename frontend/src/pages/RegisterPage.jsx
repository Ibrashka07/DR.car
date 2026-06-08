import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '', email: '', password: '', password2: '',
    first_name: '', last_name: '',
  });
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register/', form);
      await login(form.username, form.password);
      navigate('/');
    } catch (err) {
      const data = err.response?.data;
      setError(data ? JSON.stringify(data) : 'Ошибка регистрации');
    }
  }

  const set = (field) => (v) => setForm(f => ({ ...f, [field]: v }));

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '2rem',
    }}>
      <div style={{
        width: '100%', maxWidth: 420,
        background: '#111', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px', padding: '2.5rem',
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontWeight: 700, fontSize: '1.75rem' }}>
          dr.car
        </h1>
        <h2 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Регистрация</h2>

        {error && <p style={{ color: '#ff4444', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          {[
            ['Логин *', 'username', 'text'],
            ['Email *', 'email', 'email'],
            ['Имя', 'first_name', 'text'],
            ['Фамилия', 'last_name', 'text'],
            ['Пароль *', 'password', 'password'],
            ['Повторите пароль *', 'password2', 'password'],
          ].map(([label, field, type]) => (
            <div key={field} style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
                {label}
              </label>
              <input type={type} value={form[field]} onChange={e => set(field)(e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem 1rem',
                  background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px', color: 'white', fontSize: '1rem',
                }} />
            </div>
          ))}
          <button type="submit" style={{
            width: '100%', padding: '0.875rem',
            background: 'white', color: '#000', border: 'none',
            borderRadius: '8px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
            marginTop: '0.5rem',
          }}>
            Зарегистрироваться
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'rgba(255,255,255,0.5)' }}>
          Уже есть аккаунт? <Link to="/login" style={{ color: 'white' }}>Войти</Link>
        </p>
      </div>
    </div>
  );
}
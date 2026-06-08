import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await login(form.username, form.password);
      navigate('/');
    } catch {
      setError('Неверный логин или пароль');
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '2rem',
    }}>
      <div style={{
        width: '100%', maxWidth: 400,
        background: '#111', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px', padding: '2.5rem',
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontWeight: 700, fontSize: '1.75rem' }}>
          dr.car
        </h1>
        <h2 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Вход</h2>

        {error && <p style={{ color: '#ff4444', marginBottom: '1rem' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <Field label="Логин" value={form.username}
            onChange={v => setForm(f => ({ ...f, username: v }))} />
          <Field label="Пароль" type="password" value={form.password}
            onChange={v => setForm(f => ({ ...f, password: v }))} />
          <button type="submit" style={submitBtn}>Войти</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'rgba(255,255,255,0.5)' }}>
          Нет аккаунта? <Link to="/register" style={{ color: 'white' }}>Регистрация</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, type = 'text', value, onChange }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
        {label}
      </label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '0.75rem 1rem',
          background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px', color: 'white', fontSize: '1rem',
        }} />
    </div>
  );
}

const submitBtn = {
  width: '100%', padding: '0.875rem',
  background: 'white', color: '#000', border: 'none',
  borderRadius: '8px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
  marginTop: '0.5rem',
};
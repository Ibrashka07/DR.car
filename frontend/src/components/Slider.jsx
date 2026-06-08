import { useState, useEffect, useCallback } from 'react';
import slide1 from '../assets/slider/slide1.jpg';
import slide2 from '../assets/slider/slide2.jpg';
import slide3 from '../assets/slider/slide3.jpg';

const SLIDES = [
  { bg: slide1, title: 'ТЮНИНГ СОВРЕМЕННЫХ И РЕТРО АВТОМОБИЛЕЙ' },
  { bg: slide2, title: 'ПРОФЕССИОНАЛЬНЫЙ СТАЙЛИНГ И ТЮНИНГ' },
  { bg: slide3, title: 'ВАШЕ АВТО — ВАША ИНДИВИДУАЛЬНОСТЬ' },
];

export default function Slider() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % SLIDES.length);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    const id = setInterval(next, 10000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <header style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      {/* Slides */}
      {SLIDES.map((slide, i) => (
        <div key={i} style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${slide.bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: i === current ? 1 : 0,
          transition: 'opacity 1.2s ease-in-out',
        }} />
      ))}

      {/* Dark overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.45)',
        pointerEvents: 'none',
      }} />

      {/* Hero text */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        paddingTop: '80px',
      }}>
        <h1 style={{
          fontSize: 'clamp(1.2rem, 4vw, 3.5rem)',
          fontWeight: 700, textAlign: 'center',
          letterSpacing: '-0.02em', textTransform: 'uppercase',
          textShadow: '0 2px 20px rgba(0,0,0,0.5)',
          maxWidth: '900px', padding: '0 1.5rem',
          lineHeight: 1.2,
        }}>
          {SLIDES[current].title}
        </h1>
      </div>

      {/* Prev / Next buttons */}
      <SliderBtn side="left" onClick={prev}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="#111" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </SliderBtn>
      <SliderBtn side="right" onClick={next}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="#111" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </SliderBtn>

      {/* Dots */}
      <div style={{
        position: 'absolute', bottom: '1.5rem', left: 0, right: 0,
        display: 'flex', justifyContent: 'center', gap: '0.75rem',
      }}>
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} style={{
            width: i === current ? 28 : 10,
            height: 10, borderRadius: 8, border: 'none',
            background: i === current ? 'white' : 'rgba(255,255,255,0.5)',
            transition: 'all 0.2s', cursor: 'pointer', padding: 0,
          }} />
        ))}
      </div>
    </header>
  );
}

function SliderBtn({ side, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      position: 'absolute', top: '50%',
      [side]: '1rem',
      transform: 'translateY(-50%)',
      zIndex: 20, width: 40, height: 40, borderRadius: '50%',
      border: 'none', background: 'rgba(255,255,255,0.9)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', backdropFilter: 'blur(4px)',
      boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
    }}>
      {children}
    </button>
  );
}
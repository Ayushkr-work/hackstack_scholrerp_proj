import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const PALETTE = {
  default: { dot: '#22C55E', glow: 'rgba(34,197,94,0.30)',  trail: 'rgba(34,197,94,0.10)'  },
  admin:   { dot: '#D4AF37', glow: 'rgba(212,175,55,0.30)', trail: 'rgba(212,175,55,0.10)' },
  student: { dot: '#4ADE80', glow: 'rgba(74,222,128,0.30)', trail: 'rgba(74,222,128,0.10)' },
};

export default function Cursor() {
  const dot = useRef(null);
  const glow = useRef(null);
  const trail = useRef(null);
  const { role } = useAuth() || {};
  const pal = PALETTE[role] || PALETTE.default;

  useEffect(() => {
    if (dot.current) {
      dot.current.style.background = pal.dot;
      dot.current.style.boxShadow = `0 0 8px ${pal.dot}`;
    }
    if (glow.current) glow.current.style.background = pal.glow;
    if (trail.current) trail.current.style.background = pal.trail;
  }, [role, pal]);

  useEffect(() => {
    let mx = 0, my = 0, gx = 0, gy = 0, tx = 0, ty = 0, raf;

    const onMove = e => {
      mx = e.clientX;
      my = e.clientY;

      if (dot.current) {
        dot.current.style.left = mx + 'px';
        dot.current.style.top = my + 'px';
      }
    };

    const tick = () => {
      gx += (mx - gx) * 0.2;
      gy += (my - gy) * 0.2;

      tx += (gx - tx) * 0.12;
      ty += (gy - ty) * 0.12;

      if (glow.current) {
        glow.current.style.left = gx + 'px';
        glow.current.style.top = gy + 'px';
      }

      if (trail.current) {
        trail.current.style.left = tx + 'px';
        trail.current.style.top = ty + 'px';
      }

      raf = requestAnimationFrame(tick);
    };

    const onEnter = () => {
      if (dot.current) {
        dot.current.style.transform = 'translate(-50%,-50%) scale(0)';
        dot.current.style.opacity = '0';
      }

      if (glow.current) {
        glow.current.style.width = '36px';
        glow.current.style.height = '36px';
        glow.current.style.borderRadius = '8px';
        glow.current.style.filter = 'blur(8px)';
      }
    };

    const onLeave = () => {
      if (dot.current) {
        dot.current.style.transform = 'translate(-50%,-50%) scale(1)';
        dot.current.style.opacity = '1';
      }

      if (glow.current) {
        glow.current.style.width = '22px';
        glow.current.style.height = '22px';
        glow.current.style.borderRadius = '50%';
        glow.current.style.filter = 'blur(6px)';
      }
    };

    const attach = () => {
      document.querySelectorAll('a,button,input,select,textarea,[data-hover]')
        .forEach(el => {
          el.removeEventListener('mouseenter', onEnter);
          el.removeEventListener('mouseleave', onLeave);
          el.addEventListener('mouseenter', onEnter);
          el.addEventListener('mouseleave', onLeave);
        });
    };

    const obs = new MutationObserver(attach);
    obs.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('mousemove', onMove);
    attach();

    raf = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      obs.disconnect();
    };
  }, [role]);

  const base = {
    position: 'fixed',
    pointerEvents: 'none',
    transform: 'translate(-50%,-50%)',
    borderRadius: '50%',
    transition: 'all 0.2s ease'
  };

  return (
    <>
      <div
        ref={trail}
        style={{
          ...base,
          zIndex: 99994,
          width: '45px',
          height: '45px',
          background: pal.trail,
          filter: 'blur(14px)'
        }}
      />
      <div
        ref={glow}
        style={{
          ...base,
          zIndex: 99996,
          width: '22px',
          height: '22px',
          background: pal.glow,
          filter: 'blur(6px)'
        }}
      />
      <div
        ref={dot}
        style={{
          ...base,
          zIndex: 99999,
          width: '5px',
          height: '5px',
          background: pal.dot
        }}
      />
    </>
  );
}
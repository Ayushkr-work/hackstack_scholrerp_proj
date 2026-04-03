import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const COLORS = {
  default: '#22C55E',
  admin:   '#D4AF37',
  student: '#22C55E',
};

export default function Cursor() {
  const dot  = useRef(null);
  const { role } = useAuth() || {};
  const color = COLORS[role] || COLORS.default;

  // Update dot color on role change
  useEffect(() => {
    if (!dot.current) return;
    dot.current.style.background  = color;
    dot.current.style.boxShadow   = `0 0 8px ${color}99`;
  }, [role, color]);

  useEffect(() => {
    let tx = -100, ty = -100; // target (mouse position)
    let cx = -100, cy = -100; // current (dot position, lags behind)
    let raf;
    let hovering = false;

    const onMove = e => { tx = e.clientX; ty = e.clientY; };

    const tick = () => {
      cx += (tx - cx) * 0.15;
      cy += (ty - cy) * 0.15;
      if (dot.current) {
        dot.current.style.left = cx + 'px';
        dot.current.style.top  = cy + 'px';
      }
      raf = requestAnimationFrame(tick);
    };

    const onEnter = () => {
      hovering = true;
      if (!dot.current) return;
      dot.current.style.transform  = 'translate(-50%,-50%) scale(2)';
      dot.current.style.background = COLORS.admin; // gold on hover
      dot.current.style.boxShadow  = `0 0 10px ${COLORS.admin}99`;
    };

    const onLeave = () => {
      hovering = false;
      if (!dot.current) return;
      const c = COLORS[role] || COLORS.default;
      dot.current.style.transform  = 'translate(-50%,-50%) scale(1)';
      dot.current.style.background = c;
      dot.current.style.boxShadow  = `0 0 8px ${c}99`;
    };

    const attach = () => {
      document.querySelectorAll('a,button,input,select,textarea,[data-hover]').forEach(el => {
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

  return (
    <div ref={dot} style={{
      position:      'fixed',
      pointerEvents: 'none',
      zIndex:        99999,
      width:         '6px',
      height:        '6px',
      borderRadius:  '50%',
      background:    color,
      boxShadow:     `0 0 8px ${color}99`,
      transform:     'translate(-50%,-50%)',
      transition:    'transform .2s ease, background .25s ease, box-shadow .25s ease',
      willChange:    'left, top',
    }}/>
  );
}

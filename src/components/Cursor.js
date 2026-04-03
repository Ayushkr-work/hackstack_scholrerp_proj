import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const COLORS = {
  default: { primary:'#22C55E', ring:'rgba(34,197,94,0.30)',  bg:'rgba(34,197,94,0.12)'  },
  admin:   { primary:'#D4AF37', ring:'rgba(212,175,55,0.30)', bg:'rgba(212,175,55,0.12)' },
  student: { primary:'#22C55E', ring:'rgba(34,197,94,0.28)',  bg:'rgba(34,197,94,0.10)'  },
};

// Spawn a ripple burst at (x, y) with given color — pure DOM, no React state
function spawnRipple(x, y, color) {
  const RINGS = [
    { size:18, delay:0,    dur:420, opacity:0.7 },
    { size:32, delay:60,   dur:480, opacity:0.45 },
    { size:48, delay:120,  dur:540, opacity:0.25 },
  ];

  RINGS.forEach(({ size, delay, dur, opacity }) => {
    const el = document.createElement('div');
    el.style.cssText = `
      position:fixed;
      pointer-events:none;
      z-index:99990;
      left:${x}px;
      top:${y}px;
      width:${size}px;
      height:${size}px;
      border-radius:6px;
      border:1.5px solid ${color};
      transform:translate(-50%,-50%) scale(0.3) rotate(15deg);
      opacity:${opacity};
      transition:transform ${dur}ms cubic-bezier(0.2,0,0.4,1) ${delay}ms,
                 opacity   ${dur}ms ease ${delay}ms;
    `;
    document.body.appendChild(el);

    // Trigger animation on next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transform = `translate(-50%,-50%) scale(1) rotate(0deg)`;
        el.style.opacity   = '0';
      });
    });

    setTimeout(() => el.remove(), dur + delay + 50);
  });

  // Center flash dot
  const flash = document.createElement('div');
  flash.style.cssText = `
    position:fixed;
    pointer-events:none;
    z-index:99991;
    left:${x}px;
    top:${y}px;
    width:6px;
    height:6px;
    border-radius:2px;
    background:${color};
    transform:translate(-50%,-50%) scale(1);
    opacity:1;
    transition:transform 280ms ease, opacity 280ms ease;
  `;
  document.body.appendChild(flash);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      flash.style.transform = 'translate(-50%,-50%) scale(2.5)';
      flash.style.opacity   = '0';
    });
  });
  setTimeout(() => flash.remove(), 350);
}

export default function Cursor() {
  const outer = useRef(null);
  const inner = useRef(null);
  const { role } = useAuth() || {};
  const col = COLORS[role] || COLORS.default;

  // Sync colors on role change
  useEffect(() => {
    if (outer.current) {
      outer.current.style.borderColor = col.ring;
      outer.current.style.background  = col.bg;
    }
    if (inner.current) {
      inner.current.style.background = col.primary;
    }
  }, [role, col]);

  useEffect(() => {
    let mx = 0, my = 0, ox = 0, oy = 0, raf;

    // ── Mouse move ──────────────────────────────────────────────
    const onMove = e => {
      mx = e.clientX;
      my = e.clientY;
      if (inner.current) {
        inner.current.style.left = mx + 'px';
        inner.current.style.top  = my + 'px';
      }
    };

    // ── RAF loop: outer lags ─────────────────────────────────────
    const tick = () => {
      ox += (mx - ox) * 0.13;
      oy += (my - oy) * 0.13;
      if (outer.current) {
        outer.current.style.left = ox + 'px';
        outer.current.style.top  = oy + 'px';
      }
      raf = requestAnimationFrame(tick);
    };

    // ── Click: ripple + cursor shrink ────────────────────────────
    const onClick = e => {
      const c = COLORS[role] || COLORS.default;
      // Alternate green/gold for visual interest
      const rippleColor = Math.random() > 0.5 ? c.primary : (role === 'admin' ? '#22C55E' : '#D4AF37');
      spawnRipple(e.clientX, e.clientY, rippleColor);

      // Cursor shrink feedback
      if (inner.current) {
        inner.current.style.transform = 'translate(-50%,-50%) scale(0.5)';
        inner.current.style.opacity   = '0.6';
        setTimeout(() => {
          if (inner.current) {
            inner.current.style.transform = 'translate(-50%,-50%) scale(1)';
            inner.current.style.opacity   = '1';
          }
        }, 150);
      }
      if (outer.current) {
        outer.current.style.transform = 'translate(-50%,-50%) scale(0.85)';
        setTimeout(() => {
          if (outer.current) outer.current.style.transform = 'translate(-50%,-50%) scale(1)';
        }, 180);
      }
    };

    // ── Hover: outer expands, inner shrinks ──────────────────────
    const onEnter = () => {
      const c = COLORS[role] || COLORS.default;
      if (outer.current) {
        outer.current.style.width        = '42px';
        outer.current.style.height       = '42px';
        outer.current.style.borderRadius = '11px';
        outer.current.style.borderColor  = c.primary;
        outer.current.style.background   = c.bg;
        outer.current.style.boxShadow    = `0 0 12px ${c.ring}`;
      }
      if (inner.current) {
        inner.current.style.width        = '4px';
        inner.current.style.height       = '4px';
        inner.current.style.opacity      = '0.5';
      }
    };

    const onLeave = () => {
      const c = COLORS[role] || COLORS.default;
      if (outer.current) {
        outer.current.style.width        = '28px';
        outer.current.style.height       = '28px';
        outer.current.style.borderRadius = '7px';
        outer.current.style.borderColor  = c.ring;
        outer.current.style.background   = c.bg;
        outer.current.style.boxShadow    = 'none';
      }
      if (inner.current) {
        inner.current.style.width        = '5px';
        inner.current.style.height       = '5px';
        inner.current.style.opacity      = '1';
      }
    };

    // ── Attach hover listeners ───────────────────────────────────
    const attach = () => {
      document.querySelectorAll('a,button,input,select,textarea,[data-hover]').forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };

    const obs = new MutationObserver(attach);
    obs.observe(document.body, { childList:true, subtree:true });

    document.addEventListener('mousemove', onMove);
    document.addEventListener('click', onClick);
    attach();
    raf = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('click', onClick);
      cancelAnimationFrame(raf);
      obs.disconnect();
    };
  }, [role]);

  const base = {
    position:      'fixed',
    pointerEvents: 'none',
    transform:     'translate(-50%,-50%)',
    zIndex:        99999,
  };

  return (
    <>
      {/* Outer lagging rounded-square ring */}
      <div ref={outer} style={{
        ...base,
        width:        '28px',
        height:       '28px',
        borderRadius: '7px',
        border:       `1.5px solid ${col.ring}`,
        background:   col.bg,
        backdropFilter: 'blur(3px)',
        transition:   [
          'width .20s ease',
          'height .20s ease',
          'border-radius .20s ease',
          'border-color .20s ease',
          'background .20s ease',
          'box-shadow .20s ease',
          'transform .18s ease',
        ].join(', '),
      }}/>

      {/* Inner sharp square — instant follow */}
      <div ref={inner} style={{
        ...base,
        width:        '5px',
        height:       '5px',
        borderRadius: '2px',
        background:   col.primary,
        transition:   'width .16s ease, height .16s ease, opacity .16s ease, transform .15s ease',
      }}/>
    </>
  );
}

import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard, Users, FileText, Bell, Calendar,
  Briefcase, CreditCard, LogOut, User, ShieldCheck,
  HeadphonesIcon, Sun, Moon, Menu, X, ChevronDown
} from 'lucide-react';

const adminLinks = [
  { to:'/admin',            icon:LayoutDashboard, label:'Dashboard'  },
  { to:'/admin/students',   icon:Users,           label:'Students'   },
  { to:'/admin/results',    icon:FileText,        label:'Results'    },
  { to:'/admin/notices',    icon:Bell,            label:'Notices'    },
  { to:'/admin/leaves',     icon:Calendar,        label:'Leaves'     },
  { to:'/admin/fees',       icon:CreditCard,      label:'Fees'       },
  { to:'/admin/placements', icon:Briefcase,       label:'Placements' },
  { to:'/admin/helpdesk',   icon:HeadphonesIcon,  label:'Helpdesk'   },
  { to:'/admin/reset-logs', icon:ShieldCheck,     label:'Resets'     },
];
const studentLinks = [
  { to:'/student',             icon:LayoutDashboard, label:'Dashboard'  },
  { to:'/student/profile',     icon:User,            label:'Profile'    },
  { to:'/student/results',     icon:FileText,        label:'Results'    },
  { to:'/student/notices',     icon:Bell,            label:'Notices'    },
  { to:'/student/leaves',      icon:Calendar,        label:'Leave'      },
  { to:'/student/fees',        icon:CreditCard,      label:'Fees'       },
  { to:'/student/placements',  icon:Briefcase,       label:'Placements' },
  { to:'/student/helpdesk',    icon:HeadphonesIcon,  label:'Helpdesk'   },
];

export default function DashboardLayout({ children }) {
  const { user, role, logout } = useAuth();
  const { isDark, toggle }     = useTheme();
  const navigate               = useNavigate();
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const links = role === 'admin' ? adminLinks : studentLinks;

  const avatarGrad = role === 'admin'
    ? 'linear-gradient(135deg,#D4AF37,#B8960C)'
    : 'linear-gradient(135deg,#22C55E,#15803D)';

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>

      {/* ── Top Navbar ── */}
      <header style={{
        height: '60px',
        background: isDark ? 'rgba(15,19,32,0.95)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'}`,
        boxShadow: isDark ? 'none' : '0 1px 0 rgba(0,0,0,0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        padding: '0 1.5rem',
        gap: '1rem',
      }}>

        {/* ── LEFT: Logo ── */}
        <div className="flex items-center gap-3">
          <NavLink to={role==='admin'?'/admin':'/student'}
            className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center shrink-0"
              style={{ background:'linear-gradient(135deg,#22C55E,#15803D)', padding:'2px' }}>
              <img src="/logo.png" alt="ScholrERP" className="w-full h-full object-contain rounded-lg"/>
            </div>
            <span className="font-bold text-sm hidden sm:block"
              style={{ color:'var(--text1)' }}>
              Scholr<span style={{ color:'var(--p)' }}>ERP</span>
            </span>
          </NavLink>

          {/* Mobile menu button */}
          <button className="lg:hidden p-1.5 rounded-lg transition-all ml-1"
            style={{ color:'var(--text3)', border:`1px solid ${isDark?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.10)'}` }}
            onClick={() => setMobileOpen(p=>!p)}>
            {mobileOpen ? <X size={15}/> : <Menu size={15}/>}
          </button>
        </div>

        {/* ── CENTER: Nav links (perfectly centered) ── */}
        <nav className="hidden lg:flex items-center gap-1">
          {links.map(({ to, icon:Icon, label }) => (
            <NavLink key={to} to={to} end={to==='/admin'||to==='/student'}
              className={({ isActive }) => `nav-link ${isActive?'active':''}`}>
              <Icon size={13}/>{label}
            </NavLink>
          ))}
        </nav>

        {/* ── RIGHT: Theme toggle + Profile ── */}
        <div className="flex items-center gap-2 justify-end">

          {/* Theme toggle pill */}
          <motion.button
            onClick={toggle}
            title={isDark ? 'Switch to Light' : 'Switch to Dark'}
            whileTap={{ scale: 0.92 }}
            style={{
              width: '52px',
              height: '28px',
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              padding: '3px',
              flexShrink: 0,
              background: isDark
                ? 'linear-gradient(135deg,#052e0f,#071a0a)'
                : 'linear-gradient(135deg,#dcfce7,#bbf7d0)',
              border: `1.5px solid ${isDark ? 'rgba(34,197,94,0.35)' : 'rgba(34,197,94,0.30)'}`,
              boxShadow: isDark
                ? 'inset 0 1px 3px rgba(0,0,0,0.4)'
                : 'inset 0 1px 3px rgba(0,0,0,0.06)',
              cursor: 'none',
              transition: 'background 0.3s ease, border-color 0.3s ease',
            }}>
            <motion.div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isDark ? '#22C55E' : '#ffffff',
                boxShadow: isDark
                  ? '0 2px 8px rgba(34,197,94,0.5)'
                  : '0 2px 6px rgba(0,0,0,0.15)',
              }}
              animate={{ x: isDark ? 24 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}>
              {isDark
                ? <Moon size={11} color="#fff"/>
                : <Sun  size={11} color="#D4AF37"/>
              }
            </motion.div>
          </motion.button>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(p=>!p)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all"
              style={{
                border: `1px solid ${isDark?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.10)'}`,
                background: 'transparent',
              }}
              onMouseEnter={e => e.currentTarget.style.background = isDark?'rgba(34,197,94,0.10)':'rgba(34,197,94,0.06)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: avatarGrad }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold leading-none" style={{ color:'var(--text1)' }}>
                  {user?.name?.split(' ')[0]}
                </p>
                <p className="text-[10px] capitalize mt-0.5" style={{ color:'var(--text3)' }}>{role}</p>
              </div>
              <ChevronDown size={12} style={{ color:'var(--text3)' }}/>
            </button>

            <AnimatePresence>
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)}/>
                  <motion.div
                    className="absolute right-0 top-full mt-2 w-56 rounded-2xl overflow-hidden z-50"
                    style={{
                      background: isDark ? '#07130A' : '#ffffff',
                      border: `1px solid ${isDark?'rgba(34,197,94,0.20)':'rgba(0,0,0,0.10)'}`,
                      boxShadow: isDark
                        ? '0 20px 50px rgba(0,0,0,0.6)'
                        : '0 8px 32px rgba(0,0,0,0.10)',
                    }}
                    initial={{ opacity:0, y:-8, scale:.96 }}
                    animate={{ opacity:1, y:0, scale:1 }}
                    exit={{ opacity:0, y:-8, scale:.96 }}
                    transition={{ duration:.15, ease:'easeOut' }}>
                    <div className="p-4" style={{ borderBottom:`1px solid ${isDark?'rgba(255,255,255,0.07)':'rgba(0,0,0,0.07)'}` }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                          style={{ background: avatarGrad }}>
                          {user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color:'var(--text1)' }}>{user?.name}</p>
                          <p className="text-xs mt-0.5 truncate max-w-[140px]" style={{ color:'var(--text3)' }}>{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      {role === 'student' && (
                        <button
                          onClick={() => { navigate('/student/profile'); setProfileOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                          style={{ color:'var(--text2)' }}
                          onMouseEnter={e=>e.currentTarget.style.background=isDark?'rgba(34,197,94,0.10)':'rgba(34,197,94,0.06)'}
                          onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                          <User size={14}/> My Profile
                        </button>
                      )}
                      <button
                        onClick={() => { logout(); navigate('/'); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                        style={{ color:'#EF4444' }}
                        onMouseEnter={e=>e.currentTarget.style.background='rgba(239,68,68,0.08)'}
                        onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                        <LogOut size={14}/> Sign Out
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* ── Mobile nav ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
            exit={{ height:0, opacity:0 }} transition={{ duration:.2 }}
            className="overflow-hidden sticky top-[60px] z-40"
            style={{
              background: isDark ? '#0f1320' : '#ffffff',
              borderBottom: `1px solid ${isDark?'rgba(255,255,255,0.07)':'rgba(0,0,0,0.08)'}`,
            }}>
            <div className="p-3 grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {links.map(({ to, icon:Icon, label }) => (
                <NavLink key={to} to={to} end={to==='/admin'||to==='/student'}
                  className={({ isActive }) => `nav-link ${isActive?'active':''}`}
                  onClick={() => setMobileOpen(false)}>
                  <Icon size={13}/>{label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Page content ── */}
      <motion.main
        className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto"
        initial={{ opacity:0, y:12 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:.3, ease:'easeOut' }}>
        {children}
      </motion.main>
    </div>
  );
}

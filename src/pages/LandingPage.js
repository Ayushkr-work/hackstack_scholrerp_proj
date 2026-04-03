import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, BarChart3, Sun, Moon, GraduationCap, Users, FileText, CreditCard } from 'lucide-react';
import ThreeBackground from '../components/ThreeBackground';
import { useTheme } from '../context/ThemeContext';

const stats = [
  { value: '500+', label: 'Institutions' },
  { value: '1M+',  label: 'Students'     },
  { value: '99.9%',label: 'Uptime'       },
  { value: '50+',  label: 'Countries'    },
];

const features = [
  { icon: Zap,       title: 'Lightning Fast',   desc: 'Real-time updates across all modules with zero lag.',        color: '#3B82F6' },
  { icon: Shield,    title: 'Secure Access',     desc: 'Role-based authentication with JWT and encrypted storage.',  color: '#10B981' },
  { icon: BarChart3, title: 'Smart Analytics',   desc: 'Data-driven dashboards with actionable insights.',          color: '#F59E0B' },
];

const modules = [
  { icon: Users,    label: 'Student Management' },
  { icon: FileText, label: 'Results & Grades'   },
  { icon: CreditCard,label:'Fee Payments'       },
  { icon: GraduationCap, label: 'Placements'    },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { isDark, toggle } = useTheme();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text1)', overflowX: 'hidden', position: 'relative' }}>

      {/* 3D background — only visible in dark mode */}
      {isDark && (
        <div className="absolute inset-0 z-0">
          <ThreeBackground />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(11,15,25,0.3), rgba(11,15,25,0.85) 80%, rgba(11,15,25,1))' }}/>
        </div>
      )}

      {/* Light mode soft gradient background */}
      {!isDark && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div style={{ position:'absolute', top:'-10%', left:'-5%', width:'50%', height:'60%', background:'radial-gradient(ellipse, rgba(59,130,246,0.10) 0%, transparent 70%)', borderRadius:'50%' }}/>
          <div style={{ position:'absolute', top:'20%', right:'-5%', width:'40%', height:'50%', background:'radial-gradient(ellipse, rgba(16,185,129,0.08) 0%, transparent 70%)', borderRadius:'50%' }}/>
          <div style={{ position:'absolute', bottom:'0', left:'30%', width:'40%', height:'40%', background:'radial-gradient(ellipse, rgba(139,92,246,0.07) 0%, transparent 70%)', borderRadius:'50%' }}/>
        </div>
      )}

      {/* ── Navbar ── */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5"
        style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>

        {/* Logo */}
        <motion.div className="flex items-center gap-2.5" initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}>
          <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center"
            style={{ background:'linear-gradient(135deg,#3B82F6,#2563EB)', padding:'2px' }}>
            <img src="/logo.png" alt="ScholrERP" className="w-full h-full object-contain rounded-lg"/>
          </div>
          <span className="font-bold text-lg" style={{ color:'var(--text1)' }}>
            Scholr<span style={{ color:'var(--p)' }}>ERP</span>
          </span>
        </motion.div>

        {/* Right controls */}
        <motion.div className="flex items-center gap-3" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}>

          {/* Theme toggle */}
          <motion.button onClick={toggle} whileTap={{ scale:.92 }} title={isDark?'Light mode':'Dark mode'}
            style={{
              width:'52px', height:'28px', borderRadius:'999px',
              display:'flex', alignItems:'center', padding:'3px',
              background: isDark ? 'linear-gradient(135deg,#1e3a5f,#1a2a4a)' : 'linear-gradient(135deg,#dbeafe,#bfdbfe)',
              border: `1.5px solid ${isDark ? 'rgba(59,130,246,0.35)' : 'rgba(59,130,246,0.30)'}`,
              cursor: 'none',
            }}>
            <motion.div
              style={{ width:'22px', height:'22px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                background: isDark ? '#3B82F6' : '#ffffff',
                boxShadow: isDark ? '0 2px 8px rgba(59,130,246,0.5)' : '0 2px 6px rgba(0,0,0,0.15)',
              }}
              animate={{ x: isDark ? 24 : 0 }}
              transition={{ type:'spring', stiffness:500, damping:35 }}>
              {isDark ? <Moon size={11} color="#fff"/> : <Sun size={11} color="#F59E0B"/>}
            </motion.div>
          </motion.button>

          <button onClick={() => navigate('/select-college')}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ border:`1px solid ${isDark?'rgba(255,255,255,0.12)':'rgba(0,0,0,0.12)'}`, color:'var(--text2)', background:'transparent' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.08)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)'; e.currentTarget.style.color = 'var(--p)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = isDark?'rgba(255,255,255,0.12)':'rgba(0,0,0,0.12)'; e.currentTarget.style.color = 'var(--text2)'; }}>
            Login
          </button>

          <button onClick={() => navigate('/register-college')} className="btn-primary text-sm px-5 py-2">
            Get Started
          </button>
        </motion.div>
      </nav>

      {/* ── Hero ── */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-16 pb-8">
        <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:.15, duration:.6 }}>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
            style={{ background: isDark ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.25)', color:'var(--p)' }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background:'var(--p)' }}/>
            Next-Gen College Management System
          </div>

          {/* Heading */}
          <h1 className="font-black mb-6 leading-tight" style={{ fontSize:'clamp(2.5rem,7vw,5rem)' }}>
            <span style={{ color:'var(--text1)' }}>Manage Your</span><br/>
            <span className="gradient-text">College Smarter</span>
          </h1>

          {/* Description */}
          <p className="text-lg max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color:'var(--text3)' }}>
            A premium ERP platform for institutions — manage students, results, fees, placements and more with a beautiful modern interface.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button onClick={() => navigate('/select-college')}
              className="btn-primary flex items-center gap-2 px-8 py-3.5 text-base"
              whileHover={{ scale:1.03 }} whileTap={{ scale:.97 }}>
              Enter Portal <ArrowRight size={18}/>
            </motion.button>
            <motion.button onClick={() => navigate('/register-college')}
              className="px-8 py-3.5 rounded-xl text-base font-semibold transition-all"
              style={{ border:`1.5px solid ${isDark?'rgba(255,255,255,0.12)':'rgba(0,0,0,0.12)'}`, color:'var(--text2)', background:'transparent' }}
              whileHover={{ scale:1.03, borderColor:'rgba(59,130,246,0.4)', color:'var(--p)' }}
              whileTap={{ scale:.97 }}>
              Register College
            </motion.button>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div className="flex flex-wrap justify-center gap-8 mt-14 mb-4"
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:.4 }}>
          {stats.map(({ value, label }, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl font-black gradient-text">{value}</p>
              <p className="text-xs mt-0.5" style={{ color:'var(--text3)' }}>{label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Feature cards ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-12">
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-5"
          initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:.5 }}>
          {features.map(({ icon:Icon, title, desc, color }, i) => (
            <motion.div key={i}
              className="rounded-2xl p-6 transition-all"
              style={{
                background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.70)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'}`,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.06)',
              }}
              whileHover={{ y:-4, boxShadow: isDark ? `0 12px 40px rgba(0,0,0,0.4)` : `0 12px 40px rgba(59,130,246,0.10)` }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background:`${color}18` }}>
                <Icon size={20} style={{ color }}/>
              </div>
              <h3 className="font-bold text-base mb-2" style={{ color:'var(--text1)' }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color:'var(--text3)' }}>{desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Module pills */}
        <motion.div className="flex flex-wrap justify-center gap-3 mt-10"
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.7 }}>
          {modules.map(({ icon:Icon, label }, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
              style={{
                background: isDark ? 'rgba(59,130,246,0.10)' : 'rgba(59,130,246,0.07)',
                border: '1px solid rgba(59,130,246,0.20)',
                color: 'var(--p)',
              }}>
              <Icon size={14}/>{label}
            </div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div className="text-center mt-14 p-8 rounded-2xl"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(16,185,129,0.08))'
              : 'linear-gradient(135deg, rgba(59,130,246,0.07), rgba(16,185,129,0.05))',
            border: `1px solid ${isDark ? 'rgba(59,130,246,0.20)' : 'rgba(59,130,246,0.15)'}`,
          }}
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:.8 }}>
          <h2 className="text-2xl font-black mb-2" style={{ color:'var(--text1)' }}>
            Ready to transform your institution?
          </h2>
          <p className="mb-6 text-sm" style={{ color:'var(--text3)' }}>
            Join 500+ institutions already using ScholrERP
          </p>
          <button onClick={() => navigate('/register-college')} className="btn-primary px-8 py-3">
            Start for Free →
          </button>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center py-6" style={{ borderTop:`1px solid ${isDark?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.06)'}` }}>
        <p className="text-xs" style={{ color:'var(--text4)' }}>
          © 2024 ScholrERP · Built for modern institutions
        </p>
      </div>
    </div>
  );
}

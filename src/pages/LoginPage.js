import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft, Shield, User, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ type }) {
  const [params] = useSearchParams();
  const collegeId   = params.get('college');
  const collegeName = params.get('name') || 'Your College';
  const [form, setForm]       = useState({ email:'', password:'' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();
  const isAdmin   = type === 'admin';

  const submit = e => {
    e.preventDefault(); setError(''); setLoading(true);
    setTimeout(() => {
      const r = login(form.email, form.password, collegeId, type);
      if (r.success) navigate(isAdmin ? '/admin' : '/student');
      else { setError(r.message); setLoading(false); }
    }, 700);
  };

  const features = isAdmin
    ? ['Manage students & results','Track fee payments','Post notices & manage leaves']
    : ['View results & grades','Pay fees online','Apply for leave & placements'];

  const accentColor = isAdmin ? '#fbbf24' : '#818cf8';
  const accentBg    = isAdmin ? 'rgba(251,191,36,0.12)' : 'rgba(99,102,241,0.12)';

  return (
    <div className="min-h-screen flex" style={{ background:'var(--bg)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center relative overflow-hidden p-12"
        style={{ background:'var(--bg2)', borderRight:'1px solid var(--border2)' }}>
        {/* Animated bg */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl"
            style={{ background:`radial-gradient(circle, ${accentColor}, transparent)` }}/>
          <div className="absolute bottom-1/4 right-1/4 w-60 h-60 rounded-full opacity-8 blur-3xl"
            style={{ background:'radial-gradient(circle, #8b5cf6, transparent)' }}/>
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern></defs>
            <rect width="100%" height="100%" fill="url(#grid)"/>
          </svg>
        </div>

        <div className="relative z-10 max-w-sm w-full">
          {/* Icon */}
          <motion.div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
            style={{ background:`linear-gradient(135deg, ${accentColor}, #8b5cf6)`, boxShadow:`0 12px 32px ${accentColor}40` }}
            animate={{ y:[0,-8,0] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}>
            {isAdmin ? <Shield size={28} color="#fff"/> : <User size={28} color="#fff"/>}
          </motion.div>

          <h2 className="text-3xl font-black mb-2 gradient-text">
            {isAdmin ? 'Admin Portal' : 'Student Portal'}
          </h2>
          <p className="text-sm mb-8" style={{ color:'var(--text3)' }}>{collegeName}</p>

          <div className="space-y-3 mb-8">
            {features.map((item,i) => (
              <motion.div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background:'var(--bg3)', border:'1px solid var(--border2)' }}
                initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} transition={{ delay:.3+i*.1 }}>
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background:accentColor }}/>
                <span className="text-sm" style={{ color:'var(--text2)' }}>{item}</span>
              </motion.div>
            ))}
          </div>

          {/* Demo credentials */}
          <div className="p-4 rounded-xl" style={{ background:'var(--bg3)', border:'1px solid var(--border)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={12} style={{ color:accentColor }}/>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color:'var(--text3)' }}>Demo Credentials</p>
            </div>
            {isAdmin
              ? <><p className="text-xs font-mono" style={{ color:accentColor }}>admin@mit.edu</p><p className="text-xs font-mono" style={{ color:'var(--text3)' }}>admin123</p></>
              : <><p className="text-xs font-mono" style={{ color:accentColor }}>arjun@student.edu</p><p className="text-xs font-mono" style={{ color:'var(--text3)' }}>student123</p></>
            }
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div className="w-full max-w-md" initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} transition={{ duration:.4 }}>
          <button onClick={() => navigate('/select-college')}
            className="flex items-center gap-2 text-sm mb-8 transition-colors"
            style={{ color:'var(--text3)' }}
            onMouseEnter={e=>e.currentTarget.style.color='var(--text1)'}
            onMouseLeave={e=>e.currentTarget.style.color='var(--text3)'}>
            <ArrowLeft size={15}/> Back
          </button>

          <div className="rounded-2xl p-8" style={{ background:'var(--bg3)', border:'1px solid var(--border)', boxShadow:'0 24px 60px rgba(0,0,0,0.4)' }}>
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background:accentBg }}>
                {isAdmin ? <Shield size={20} style={{ color:accentColor }}/> : <User size={20} style={{ color:accentColor }}/>}
              </div>
              <div>
                <h1 className="text-xl font-black" style={{ color:'var(--text1)' }}>
                  {isAdmin ? 'Admin Login' : 'Student Login'}
                </h1>
                <p className="text-xs mt-0.5" style={{ color:'var(--text3)' }}>{collegeName}</p>
              </div>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-xl text-sm flex items-center gap-2"
                style={{ background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.25)', color:'#f87171' }}>
                ⚠ {error}
              </div>
            )}

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold mb-1.5 block" style={{ color:'var(--text3)' }}>Email Address</label>
                <input className="input-dark" type="email" placeholder="Enter your email"
                  value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} required/>
              </div>
              <div>
                <label className="text-xs font-semibold mb-1.5 block" style={{ color:'var(--text3)' }}>Password</label>
                <div className="relative">
                  <input className="input-dark input-icon-right" type={showPass?'text':'password'}
                    placeholder="Enter your password"
                    value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} required/>
                  <button type="button" onClick={() => setShowPass(p=>!p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color:'var(--text3)' }}
                    onMouseEnter={e=>e.currentTarget.style.color='var(--text1)'}
                    onMouseLeave={e=>e.currentTarget.style.color='var(--text3)'}>
                    {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
              </div>

              <motion.button type="submit" disabled={loading}
                className="btn-primary w-full py-3 mt-2"
                whileHover={{ scale:1.01 }} whileTap={{ scale:.98 }}>
                {loading
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                  : `Sign in as ${isAdmin?'Admin':'Student'}`
                }
              </motion.button>
            </form>

            {!isAdmin && (
              <div className="text-center mt-4">
                <button onClick={() => navigate('/forgot-password')}
                  className="text-xs transition-colors"
                  style={{ color:'var(--text3)' }}
                  onMouseEnter={e=>e.currentTarget.style.color='#818cf8'}
                  onMouseLeave={e=>e.currentTarget.style.color='var(--text3)'}>
                  Forgot password?
                </button>
              </div>
            )}

            <p className="text-center text-xs mt-5" style={{ color:'var(--text3)' }}>
              {isAdmin?'Are you a student?':'Are you an admin?'}{' '}
              <button onClick={() => navigate(isAdmin
                ? `/student/login?college=${collegeId}&name=${encodeURIComponent(collegeName)}`
                : `/admin/login?college=${collegeId}&name=${encodeURIComponent(collegeName)}`)}
                className="font-semibold transition-colors"
                style={{ color:'#818cf8' }}
                onMouseEnter={e=>e.currentTarget.style.textDecoration='underline'}
                onMouseLeave={e=>e.currentTarget.style.textDecoration='none'}>
                Login here
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

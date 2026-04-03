import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, KeyRound, CheckCircle, XCircle, ShieldCheck } from 'lucide-react';
import { validateResetToken, resetPassword } from '../utils/mockData';

const lbl = { color:'var(--text3)', fontSize:'0.72rem', fontWeight:500 };

const strengthColors = ['','#EF4444','#F59E0B','#3B82F6','#22C55E'];
const strengthLabels = ['','Weak','Fair','Good','Strong'];

export default function ResetPassword() {
  const [params]  = useSearchParams();
  const token     = params.get('token');
  const navigate  = useNavigate();
  const [tokenInfo, setTokenInfo]     = useState(null);
  const [checking, setChecking]       = useState(true);
  const [form, setForm]               = useState({ password:'', confirm:'' });
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [done, setDone]               = useState(false);
  const [error, setError]             = useState('');

  useEffect(() => {
    if (!token) { setTokenInfo({ valid:false, message:'No reset token provided.' }); setChecking(false); return; }
    setTokenInfo(validateResetToken(token)); setChecking(false);
  }, [token]);

  const pw = form.password;
  const strength = pw.length === 0 ? 0 : [pw.length>=8, /[A-Z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)].filter(Boolean).length;

  const submit = e => {
    e.preventDefault(); setError('');
    if (pw.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (pw !== form.confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    setTimeout(() => {
      const r = resetPassword(token, pw);
      if (!r.success) { setError(r.message); setLoading(false); return; }
      setDone(true); setLoading(false);
    }, 800);
  };

  const pageWrap = (children) => (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background:'var(--bg)' }}>
      {children}
    </div>
  );

  if (checking) return pageWrap(
    <div className="w-10 h-10 border-2 rounded-full animate-spin"
      style={{ borderColor:'var(--border2)', borderTopColor:'var(--p)' }}/>
  );

  if (!tokenInfo?.valid) return pageWrap(
    <motion.div className="max-w-md w-full text-center rounded-3xl p-10"
      style={{ background:'var(--bg3)', border:'1px solid rgba(239,68,68,0.25)', boxShadow:'var(--shadow)' }}
      initial={{ scale:.88, opacity:0 }} animate={{ scale:1, opacity:1 }}>
      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
        style={{ background:'rgba(239,68,68,0.12)' }}>
        <XCircle size={32} style={{ color:'#DC2626' }}/>
      </div>
      <h2 style={{ color:'var(--text1)', fontWeight:900, fontSize:'1.3rem' }} className="mb-2">Link Invalid</h2>
      <p style={{ color:'var(--text3)', fontSize:'0.875rem' }} className="mb-6">{tokenInfo?.message}</p>
      <button onClick={() => navigate('/forgot-password')} className="btn-primary w-full">
        Request New Reset Link
      </button>
    </motion.div>
  );

  if (done) return pageWrap(
    <motion.div className="max-w-md w-full text-center rounded-3xl p-10"
      style={{ background:'var(--bg3)', border:'1px solid rgba(34,197,94,0.25)', boxShadow:'var(--shadow)' }}
      initial={{ scale:.88, opacity:0 }} animate={{ scale:1, opacity:1 }}>
      <motion.div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
        style={{ background:'rgba(34,197,94,0.12)' }}
        initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', damping:12, delay:.1 }}>
        <CheckCircle size={36} style={{ color:'var(--p)' }}/>
      </motion.div>
      <h2 style={{ color:'var(--text1)', fontWeight:900, fontSize:'1.3rem' }} className="mb-2">Password Updated!</h2>
      <p style={{ color:'var(--text3)', fontSize:'0.875rem' }} className="mb-2">Your password has been successfully changed.</p>
      <p style={{ color:'var(--text3)', fontSize:'0.82rem' }} className="mb-6">The admin portal has been updated with your new credentials.</p>
      <div className="flex items-center gap-2 justify-center p-3 rounded-xl mb-6"
        style={{ background:'rgba(34,197,94,0.10)', border:'1px solid rgba(34,197,94,0.22)' }}>
        <ShieldCheck size={15} style={{ color:'var(--p)' }}/>
        <span style={{ color:'#15803D', fontSize:'0.82rem', fontWeight:500 }}>Password change logged in admin portal</span>
      </div>
      <button onClick={() => navigate('/select-college')} className="btn-primary w-full">Go to Login</button>
    </motion.div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      style={{ background:'var(--bg)' }}>
      <div style={{ position:'absolute', top:'-10%', right:'-5%', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle, rgba(34,197,94,0.08), transparent 70%)', filter:'blur(40px)', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', bottom:'-10%', left:'-5%', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle, rgba(212,175,55,0.07), transparent 70%)', filter:'blur(40px)', pointerEvents:'none' }}/>

      <motion.div className="relative z-10 w-full max-w-md" initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}>
        <div className="rounded-3xl p-8"
          style={{ background:'var(--bg3)', border:'1px solid var(--border)', boxShadow:'var(--shadow)' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background:'rgba(34,197,94,0.12)' }}>
              <KeyRound size={22} style={{ color:'var(--p)' }}/>
            </div>
            <div>
              <h1 style={{ color:'var(--text1)', fontWeight:900, fontSize:'1.3rem' }}>Reset Password</h1>
              <p style={{ color:'var(--text3)', fontSize:'0.78rem' }}>{tokenInfo?.email}</p>
            </div>
          </div>

          <p style={{ color:'var(--text3)', fontSize:'0.85rem', lineHeight:1.6, margin:'1rem 0 1.5rem' }}>
            Create a new strong password. It will be updated in the admin portal immediately.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm"
              style={{ background:'rgba(239,68,68,0.10)', border:'1px solid rgba(239,68,68,0.25)', color:'#DC2626' }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            {/* New password */}
            <div>
              <label className="block mb-1.5" style={lbl}>New Password</label>
              <div className="relative">
                <input className="input-dark input-icon-right" type={showPass?'text':'password'}
                  placeholder="Enter new password" value={form.password}
                  onChange={e => setForm(p => ({...p, password:e.target.value}))} required/>
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color:'var(--text3)' }}
                  onMouseEnter={e => e.currentTarget.style.color='var(--text1)'}
                  onMouseLeave={e => e.currentTarget.style.color='var(--text3)'}>
                  {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
              {pw.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{ background: i<=strength ? strengthColors[strength] : 'var(--bg5)' }}/>
                    ))}
                  </div>
                  <p style={{ fontSize:'0.72rem', color: strengthColors[strength] || 'var(--text3)' }}>
                    {strengthLabels[strength]} password
                  </p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block mb-1.5" style={lbl}>Confirm Password</label>
              <div className="relative">
                <input className="input-dark input-icon-right" type={showConfirm?'text':'password'}
                  placeholder="Confirm new password" value={form.confirm}
                  onChange={e => setForm(p => ({...p, confirm:e.target.value}))} required/>
                <button type="button" onClick={() => setShowConfirm(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color:'var(--text3)' }}
                  onMouseEnter={e => e.currentTarget.style.color='var(--text1)'}
                  onMouseLeave={e => e.currentTarget.style.color='var(--text3)'}>
                  {showConfirm ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
              {form.confirm.length > 0 && (
                <p style={{ fontSize:'0.72rem', marginTop:'4px', color: form.password===form.confirm?'#15803D':'#DC2626' }}>
                  {form.password===form.confirm ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </div>

            <motion.button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5"
              whileHover={{ scale:1.02 }} whileTap={{ scale:.98 }}>
              {loading
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                : <><ShieldCheck size={17}/> Update Password</>
              }
            </motion.button>
          </form>

          <div className="mt-4 p-3 rounded-xl text-center"
            style={{ background:'var(--bg4)', border:'1px solid var(--border2)' }}>
            <p style={{ color:'var(--text3)', fontSize:'0.72rem' }}>
              🔒 Your new password will be visible to the admin in the Students panel
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

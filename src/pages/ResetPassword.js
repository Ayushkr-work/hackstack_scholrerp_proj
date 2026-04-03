import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, KeyRound, CheckCircle, XCircle, ShieldCheck } from 'lucide-react';
import { validateResetToken, resetPassword } from '../utils/mockData';

export default function ResetPassword() {
  const [params]  = useSearchParams();
  const token     = params.get('token');
  const navigate  = useNavigate();

  const [tokenInfo, setTokenInfo] = useState(null);   // { valid, email, studentId }
  const [checking, setChecking]   = useState(true);
  const [form, setForm]           = useState({ password:'', confirm:'' });
  const [showPass, setShowPass]   = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [done, setDone]           = useState(false);
  const [error, setError]         = useState('');

  useEffect(() => {
    if (!token) { setTokenInfo({ valid:false, message:'No reset token provided.' }); setChecking(false); return; }
    const result = validateResetToken(token);
    setTokenInfo(result);
    setChecking(false);
  }, [token]);

  const strength = (p) => {
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
  const pw = form.password;
  const s  = strength(pw);

  const submit = (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    setTimeout(() => {
      const result = resetPassword(token, form.password);
      if (!result.success) { setError(result.message); setLoading(false); return; }
      setDone(true);
      setLoading(false);
    }, 800);
  };

  if (checking) return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin"/>
    </div>
  );

  // Invalid / expired token
  if (!tokenInfo?.valid) return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-6">
      <motion.div className="glass-strong rounded-3xl p-10 max-w-md w-full text-center border border-red-500/20"
        initial={{ scale:.8, opacity:0 }} animate={{ scale:1, opacity:1 }}>
        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
          <XCircle size={32} className="text-red-400"/>
        </div>
        <h2 className="text-2xl font-black text-white mb-2">Link Invalid</h2>
        <p className="text-white/40 mb-6">{tokenInfo?.message}</p>
        <button onClick={() => navigate('/forgot-password')} className="btn-primary w-full">
          Request New Reset Link
        </button>
      </motion.div>
    </div>
  );

  // Success screen
  if (done) return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-6">
      <motion.div className="glass-strong rounded-3xl p-10 max-w-md w-full text-center border border-green-500/20"
        initial={{ scale:.8, opacity:0 }} animate={{ scale:1, opacity:1 }}>
        <motion.div
          className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4"
          initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', damping:12, delay:.1 }}>
          <CheckCircle size={36} className="text-green-400"/>
        </motion.div>
        <h2 className="text-2xl font-black text-white mb-2">Password Updated!</h2>
        <p className="text-white/40 mb-2">Your password has been successfully changed.</p>
        <p className="text-white/30 text-sm mb-6">
          The admin portal has been updated with your new credentials.
        </p>
        <div className="glass rounded-xl p-3 border border-green-500/20 mb-6">
          <div className="flex items-center gap-2 justify-center text-green-400 text-sm">
            <ShieldCheck size={16}/> Password change logged in admin portal
          </div>
        </div>
        <button onClick={() => navigate('/select-college')} className="btn-primary w-full">
          Go to Login
        </button>
      </motion.div>
    </div>
  );

  // Reset form
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-blue/5 rounded-full blur-3xl"/>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-3xl"/>

      <motion.div className="relative z-10 w-full max-w-md"
        initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}>
        <div className="glass-strong rounded-3xl p-8 border border-white/10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-neon-blue/20 flex items-center justify-center">
              <KeyRound size={22} className="text-neon-blue"/>
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Reset Password</h1>
              <p className="text-white/40 text-sm">{tokenInfo?.email}</p>
            </div>
          </div>

          <p className="text-white/30 text-sm mt-3 mb-6">
            Create a new strong password for your account. This will be updated in the admin portal immediately.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              ⚠ {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            {/* New password */}
            <div>
              <label className="text-xs text-white/50 font-medium mb-1.5 block">New Password</label>
              <div className="relative">
                <input
                  className="input-dark input-icon-right"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password:e.target.value }))}
                  required
                />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
              {/* Strength bar */}
              {pw.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= s ? strengthColor[s] : 'bg-white/10'}`}/>
                    ))}
                  </div>
                  <p className={`text-xs ${s<=1?'text-red-400':s===2?'text-yellow-400':s===3?'text-blue-400':'text-green-400'}`}>
                    {strengthLabel[s]} password
                  </p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="text-xs text-white/50 font-medium mb-1.5 block">Confirm Password</label>
              <div className="relative">
                <input
                  className="input-dark input-icon-right"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={form.confirm}
                  onChange={e => setForm(p => ({ ...p, confirm:e.target.value }))}
                  required
                />
                <button type="button" onClick={() => setShowConfirm(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showConfirm ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
              {form.confirm.length > 0 && (
                <p className={`text-xs mt-1 ${form.password === form.confirm ? 'text-green-400' : 'text-red-400'}`}>
                  {form.password === form.confirm ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </div>

            <motion.button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-4"
              whileHover={{ scale:1.02 }} whileTap={{ scale:.98 }}>
              {loading
                ? <div className="w-5 h-5 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin"/>
                : <><ShieldCheck size={18}/> Update Password</>
              }
            </motion.button>
          </form>

          <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs text-white/30 text-center">
              🔒 Your new password will be visible to the admin in the Students panel
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

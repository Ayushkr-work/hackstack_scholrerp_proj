import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, KeyRound, Copy, CheckCircle, ExternalLink } from 'lucide-react';
import { requestPasswordReset } from '../utils/api';

const lbl = { color:'var(--text3)', fontSize:'0.72rem', fontWeight:500 };

export default function ForgotPassword() {
  const [email, setEmail]         = useState('');
  const [step, setStep]           = useState('form');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [resetData, setResetData] = useState(null);
  const [copied, setCopied]       = useState(false);
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const result = await requestPasswordReset(email.trim().toLowerCase());
      const resetLink = `${window.location.origin}/reset-password?token=${result.token}`;
      setResetData({ ...result, resetLink });
      setStep('sent');
    } catch (err) {
      setError(err.message || 'Failed to generate reset link');
    }
    setLoading(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(resetData.resetLink);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      style={{ background:'var(--bg)' }}>
      <div style={{ position:'absolute', top:'-10%', left:'-5%', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle, rgba(34,197,94,0.08), transparent 70%)', filter:'blur(40px)', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', bottom:'-10%', right:'-5%', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle, rgba(212,175,55,0.07), transparent 70%)', filter:'blur(40px)', pointerEvents:'none' }}/>

      <motion.div className="relative z-10 w-full max-w-md" initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}>
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm mb-8 transition-colors"
          style={{ color:'var(--text3)' }}
          onMouseEnter={e => e.currentTarget.style.color='var(--text1)'}
          onMouseLeave={e => e.currentTarget.style.color='var(--text3)'}>
          <ArrowLeft size={15}/> Back to Login
        </button>

        <AnimatePresence mode="wait">
          {step === 'form' ? (
            <motion.div key="form" initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:20 }}>
              <div className="rounded-3xl p-8"
                style={{ background:'var(--bg3)', border:'1px solid var(--border)', boxShadow:'var(--shadow)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background:'rgba(34,197,94,0.12)' }}>
                    <KeyRound size={22} style={{ color:'var(--p)' }}/>
                  </div>
                  <div>
                    <h1 style={{ color:'var(--text1)', fontWeight:900, fontSize:'1.3rem' }}>Forgot Password?</h1>
                    <p style={{ color:'var(--text3)', fontSize:'0.8rem' }}>We'll generate a reset link</p>
                  </div>
                </div>

                <p style={{ color:'var(--text3)', fontSize:'0.85rem', lineHeight:1.6, margin:'1rem 0 1.5rem' }}>
                  Enter your registered student email. You'll get a reset link valid for{' '}
                  <span style={{ color:'var(--p)', fontWeight:600 }}>15 minutes</span>.
                </p>

                {error && (
                  <div className="mb-4 p-3 rounded-xl text-sm flex items-center gap-2"
                    style={{ background:'rgba(239,68,68,0.10)', border:'1px solid rgba(239,68,68,0.25)', color:'#DC2626' }}>
                    ⚠ {error}
                  </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                  <div>
                    <label className="block mb-1.5" style={lbl}>Student Email Address</label>
                    <div className="relative">
                      <Mail size={15} style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'var(--text4)', pointerEvents:'none' }}/>
                      <input className="input-dark input-icon-left" type="email" placeholder="your@email.com"
                        value={email} onChange={e => setEmail(e.target.value)} required/>
                    </div>
                  </div>
                  <motion.button type="submit" disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-3.5"
                    whileHover={{ scale:1.02 }} whileTap={{ scale:.98 }}>
                    {loading
                      ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                      : <><Mail size={15}/> Send Reset Link</>
                    }
                  </motion.button>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div key="sent" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
              <div className="rounded-3xl p-8"
                style={{ background:'var(--bg3)', border:'1px solid rgba(34,197,94,0.25)', boxShadow:'var(--shadow)' }}>
                <div className="text-center mb-6">
                  <motion.div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background:'rgba(34,197,94,0.12)' }}
                    initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', damping:15 }}>
                    <Mail size={28} style={{ color:'var(--p)' }}/>
                  </motion.div>
                  <h2 style={{ color:'var(--text1)', fontWeight:900, fontSize:'1.3rem' }} className="mb-2">Reset Link Ready!</h2>
                  <p style={{ color:'var(--text3)', fontSize:'0.85rem' }}>
                    Generated for <span style={{ color:'var(--p)', fontWeight:600 }}>{resetData?.email}</span>
                  </p>
                </div>

                <div className="rounded-2xl p-4 mb-4"
                  style={{ background:'var(--bg4)', border:'1px solid var(--border2)' }}>
                  <div className="flex items-center gap-2 mb-3 pb-3" style={{ borderBottom:'1px solid var(--border2)' }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                      style={{ background:'linear-gradient(135deg,#22C55E,#15803D)' }}>S</div>
                    <div>
                      <p style={{ color:'var(--text1)', fontSize:'0.78rem', fontWeight:600 }}>ScholrERP</p>
                      <p style={{ color:'var(--text4)', fontSize:'0.72rem' }}>noreply@scholrerp.app → {resetData?.email}</p>
                    </div>
                  </div>
                  <p style={{ color:'var(--text1)', fontWeight:600, fontSize:'0.85rem', marginBottom:'4px' }}>Password Reset Request</p>
                  <p style={{ color:'var(--text3)', fontSize:'0.78rem', marginBottom:'12px' }}>
                    Hi <span style={{ color:'var(--text1)', fontWeight:500 }}>{resetData?.studentName}</span>, use the link below to reset your password. Expires in 15 minutes.
                  </p>
                  <div className="rounded-xl p-3" style={{ background:'var(--bg3)', border:'1px solid var(--border2)' }}>
                    <p style={{ color:'var(--text4)', fontSize:'0.68rem', fontWeight:500, marginBottom:'4px' }}>Reset Link:</p>
                    <p style={{ color:'var(--p)', fontSize:'0.72rem', wordBreak:'break-all', lineHeight:1.5 }}>{resetData?.resetLink}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <motion.button onClick={() => navigate(`/reset-password?token=${resetData?.token}`)}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-3"
                    whileHover={{ scale:1.02 }} whileTap={{ scale:.98 }}>
                    <ExternalLink size={15}/> Open Reset Page
                  </motion.button>
                  <button onClick={copyLink}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
                    style={{ border:'1px solid var(--border2)', color:'var(--text2)', background:'transparent' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border2)'; e.currentTarget.style.color='var(--text2)'; }}>
                    {copied ? <><CheckCircle size={15} style={{ color:'var(--p)' }}/> Copied!</> : <><Copy size={15}/> Copy Reset Link</>}
                  </button>
                </div>

                <div className="mt-4 flex items-center gap-2 p-3 rounded-xl"
                  style={{ background:'rgba(212,175,55,0.10)', border:'1px solid rgba(212,175,55,0.25)' }}>
                  <span style={{ fontSize:'1rem' }}>⏱</span>
                  <p style={{ color:'#B8960C', fontSize:'0.78rem' }}>Link expires in <strong>15 minutes</strong>. After that, request a new one.</p>
                </div>

                <button onClick={() => { setStep('form'); setEmail(''); setError(''); }}
                  className="w-full mt-4 text-center text-sm transition-colors"
                  style={{ color:'var(--text3)' }}
                  onMouseEnter={e => e.currentTarget.style.color='var(--text1)'}
                  onMouseLeave={e => e.currentTarget.style.color='var(--text3)'}>
                  ← Send to a different email
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

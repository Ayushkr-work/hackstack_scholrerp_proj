import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, KeyRound, Copy, CheckCircle, ExternalLink } from 'lucide-react';
import { createResetToken } from '../utils/mockData';
import emailjs from 'emailjs-com';

export default function ForgotPassword() {
  const [email, setEmail]     = useState('');
  const [step, setStep]       = useState('form'); // form | sent
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [resetData, setResetData] = useState(null);
  const [copied, setCopied]   = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);

    const result = createResetToken(email.trim().toLowerCase());
    if (!result.success) { setError(result.message); setLoading(false); return; }

    const resetLink = `${window.location.origin}/reset-password?token=${result.token}`;
    setResetData({ ...result, resetLink });

    // Try to send real email via EmailJS (optional - works if configured)
    try {
      await emailjs.send(
        'service_eduverse',   // EmailJS service ID
        'template_reset',     // EmailJS template ID
        {
          to_email:    result.email,
          to_name:     result.studentName,
          reset_link:  resetLink,
          expiry_time: '15 minutes',
        },
        'YOUR_EMAILJS_PUBLIC_KEY' // Replace with your EmailJS public key
      );
    } catch {
      // EmailJS not configured — show link directly (demo mode)
    }

    setLoading(false);
    setStep('sent');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(resetData.resetLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-neon-blue/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"/>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"/>

      <motion.div className="relative z-10 w-full max-w-md"
        initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}>

        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/40 hover:text-white mb-8 transition-colors text-sm">
          <ArrowLeft size={16}/> Back to Login
        </button>

        <AnimatePresence mode="wait">
          {step === 'form' ? (
            <motion.div key="form" initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:20 }}>
              <div className="glass-strong rounded-3xl p-8 border border-white/10">
                {/* Header */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-neon-blue/20 flex items-center justify-center">
                    <KeyRound size={22} className="text-neon-blue"/>
                  </div>
                  <div>
                    <h1 className="text-2xl font-black text-white">Forgot Password?</h1>
                    <p className="text-white/40 text-sm">We'll send you a reset link</p>
                  </div>
                </div>

                <p className="text-white/30 text-sm mb-6 mt-4 leading-relaxed">
                  Enter your registered student email address. You'll receive a password reset link valid for <span className="text-neon-blue">15 minutes</span>.
                </p>

                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                    <span>⚠</span> {error}
                  </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                  <div>
                    <label className="text-xs text-white/50 font-medium mb-1.5 block">Student Email Address</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"/>
                      <input
                        className="input-dark input-icon-left"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <motion.button type="submit" disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-4"
                    whileHover={{ scale:1.02 }} whileTap={{ scale:.98 }}>
                    {loading
                      ? <div className="w-5 h-5 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin"/>
                      : <><Mail size={16}/> Send Reset Link</>
                    }
                  </motion.button>
                </form>

                <div className="mt-6 p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-white/30 font-semibold uppercase tracking-wider mb-2">Demo Emails</p>
                  {['arjun@student.edu','priya@student.edu','rahul@student.edu'].map(e => (
                    <button key={e} onClick={() => setEmail(e)}
                      className="block text-xs text-neon-blue hover:underline mb-1">{e}</button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="sent" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
              <div className="glass-strong rounded-3xl p-8 border border-neon-blue/20">
                {/* Success header */}
                <div className="text-center mb-6">
                  <motion.div
                    className="w-16 h-16 rounded-full bg-neon-blue/20 flex items-center justify-center mx-auto mb-4"
                    initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', damping:15 }}>
                    <Mail size={28} className="text-neon-blue"/>
                  </motion.div>
                  <h2 className="text-2xl font-black text-white mb-2">Reset Link Ready!</h2>
                  <p className="text-white/40 text-sm">
                    A reset link has been generated for <span className="text-neon-blue font-medium">{resetData?.email}</span>
                  </p>
                </div>

                {/* Email simulation box */}
                <div className="glass rounded-2xl p-4 border border-white/10 mb-4">
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/10">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-dark-900 font-bold text-xs">E</div>
                    <div>
                      <p className="text-xs font-semibold text-white">ScholrERP</p>
                      <p className="text-xs text-white/30">noreply@eduverse.app → {resetData?.email}</p>
                    </div>
                  </div>
                  <p className="text-sm text-white font-semibold mb-1">Password Reset Request</p>
                  <p className="text-xs text-white/50 mb-3">
                    Hi <span className="text-white">{resetData?.studentName}</span>, click the button below to reset your password. This link expires in 15 minutes.
                  </p>
                  <div className="bg-dark-700 rounded-xl p-3 border border-white/10">
                    <p className="text-xs text-white/30 mb-1 font-medium">Reset Link:</p>
                    <p className="text-xs text-neon-blue break-all leading-relaxed">{resetData?.resetLink}</p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-3">
                  <motion.button
                    onClick={() => navigate(`/reset-password?token=${resetData?.token}`)}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-3"
                    whileHover={{ scale:1.02 }} whileTap={{ scale:.98 }}>
                    <ExternalLink size={16}/> Open Reset Page
                  </motion.button>

                  <button onClick={copyLink}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-neon-blue/30 transition-all text-sm font-medium">
                    {copied ? <><CheckCircle size={16} className="text-green-400"/> Copied!</> : <><Copy size={16}/> Copy Reset Link</>}
                  </button>
                </div>

                <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                  <span className="text-yellow-400 text-lg">⏱</span>
                  <p className="text-xs text-yellow-400">This link expires in <strong>15 minutes</strong>. After that, request a new one.</p>
                </div>

                <button onClick={() => { setStep('form'); setEmail(''); setError(''); }}
                  className="w-full mt-4 text-center text-white/30 hover:text-white text-sm transition-colors">
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

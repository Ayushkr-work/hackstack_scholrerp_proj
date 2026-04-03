import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowLeft, CheckCircle } from 'lucide-react';
import { addCollege } from '../utils/mockData';

export default function RegisterCollege() {
  const [form, setForm] = useState({ name:'', email:'', password:'', adminName:'', address:'', phone:'' });
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = e => {
    e.preventDefault();
    setError('');
    const result = addCollege({ name: form.name, email: form.email, address: form.address, phone: form.phone });
    if (!result.success) { setError(result.message); return; }
    setDone(true);
  };

  if (done) return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-6">
      <motion.div className="glass-strong rounded-3xl p-10 max-w-md w-full text-center border border-green-500/20"
        initial={{ scale:.8, opacity:0 }} animate={{ scale:1, opacity:1 }}>
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-400"/>
        </div>
        <h2 className="text-2xl font-black text-white mb-2">College Registered!</h2>
        <p className="text-white/40 mb-1">
          <span className="text-neon-blue font-semibold">{form.name}</span> has been added.
        </p>
        <p className="text-white/30 text-sm mb-6">
          Login with: <span className="text-white/50">{form.email}</span> / <span className="text-white/50">{form.password}</span>
        </p>
        <button onClick={() => navigate('/select-college')} className="btn-primary w-full">
          Go to College Selection
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-3xl"/>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-blue/5 rounded-full blur-3xl"/>
      <motion.div className="relative z-10 w-full max-w-lg" initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}>
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/40 hover:text-white mb-8 transition-colors text-sm">
          <ArrowLeft size={16}/> Back to Home
        </button>
        <div className="glass-strong rounded-3xl p-8 border border-white/10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
              <GraduationCap size={22} className="text-dark-900"/>
            </div>
            <div>
              <h1 className="text-2xl font-black gradient-text">Register College</h1>
              <p className="text-white/40 text-sm">Join ScholrERP platform</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {[
              { k:'name',      label:'College Name *', ph:'MIT College of Engineering', type:'text'     },
              { k:'adminName', label:'Admin Name *',   ph:'Your full name',             type:'text'     },
              { k:'email',     label:'Email *',        ph:'admin@college.edu',          type:'email'    },
              { k:'password',  label:'Password *',     ph:'Create a strong password',   type:'password' },
            ].map(({ k, label, ph, type }) => (
              <div key={k}>
                <label className="text-xs text-white/50 font-medium mb-1.5 block">{label}</label>
                <input className="input-dark" type={type} placeholder={ph} value={form[k]} onChange={set(k)} required/>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/50 font-medium mb-1.5 block">Phone</label>
                <input className="input-dark" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={set('phone')}/>
              </div>
              <div>
                <label className="text-xs text-white/50 font-medium mb-1.5 block">Address</label>
                <input className="input-dark" placeholder="City, State" value={form.address} onChange={set('address')}/>
              </div>
            </div>
            <button type="submit" className="btn-primary w-full mt-2">Register College</button>
          </form>

          <p className="text-center text-white/30 text-sm mt-6">
            Already registered?{' '}
            <button onClick={() => navigate('/select-college')} className="text-neon-blue hover:underline">Select College</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowLeft, CheckCircle } from 'lucide-react';
import { addCollege } from '../utils/mockData';

const lbl = { color:'var(--text3)', fontSize:'0.72rem', fontWeight:500 };

export default function RegisterCollege() {
  const [form, setForm] = useState({ name:'', email:'', password:'', adminName:'', address:'', phone:'' });
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = e => {
    e.preventDefault(); setError('');
    const result = addCollege({ name:form.name, email:form.email, address:form.address, phone:form.phone });
    if (!result.success) { setError(result.message); return; }
    setDone(true);
  };

  if (done) return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background:'var(--bg)' }}>
      <motion.div className="max-w-md w-full text-center rounded-3xl p-10"
        style={{ background:'var(--bg3)', border:'1px solid rgba(34,197,94,0.25)', boxShadow:'var(--shadow)' }}
        initial={{ scale:.88, opacity:0 }} animate={{ scale:1, opacity:1 }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background:'rgba(34,197,94,0.12)' }}>
          <CheckCircle size={32} style={{ color:'var(--p)' }}/>
        </div>
        <h2 style={{ color:'var(--text1)', fontWeight:900, fontSize:'1.4rem' }} className="mb-2">College Registered!</h2>
        <p style={{ color:'var(--text3)', fontSize:'0.875rem' }} className="mb-1">
          <span style={{ color:'var(--p)', fontWeight:600 }}>{form.name}</span> has been added.
        </p>
        <p style={{ color:'var(--text3)', fontSize:'0.82rem' }} className="mb-6">
          Login with: <span style={{ color:'var(--text2)' }}>{form.email}</span> / <span style={{ color:'var(--text2)' }}>{form.password}</span>
        </p>
        <button onClick={() => navigate('/select-college')} className="btn-primary w-full">
          Go to College Selection
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      style={{ background:'var(--bg)' }}>
      {/* Soft blobs */}
      <div style={{ position:'absolute', top:'-10%', right:'-5%', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle, rgba(34,197,94,0.08), transparent 70%)', filter:'blur(40px)', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', bottom:'-10%', left:'-5%', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle, rgba(212,175,55,0.07), transparent 70%)', filter:'blur(40px)', pointerEvents:'none' }}/>

      <motion.div className="relative z-10 w-full max-w-lg" initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}>
        <button onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm mb-8 transition-colors"
          style={{ color:'var(--text3)' }}
          onMouseEnter={e => e.currentTarget.style.color='var(--text1)'}
          onMouseLeave={e => e.currentTarget.style.color='var(--text3)'}>
          <ArrowLeft size={15}/> Back to Home
        </button>

        <div className="rounded-3xl p-8"
          style={{ background:'var(--bg3)', border:'1px solid var(--border)', boxShadow:'var(--shadow)' }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background:'linear-gradient(135deg,#22C55E,#15803D)' }}>
              <GraduationCap size={22} color="#fff"/>
            </div>
            <div>
              <h1 className="gradient-text" style={{ fontWeight:900, fontSize:'1.4rem' }}>Register College</h1>
              <p style={{ color:'var(--text3)', fontSize:'0.8rem' }}>Join ScholrERP platform</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm"
              style={{ background:'rgba(239,68,68,0.10)', border:'1px solid rgba(239,68,68,0.25)', color:'#DC2626' }}>
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {[
              { k:'name',      label:'College Name *', ph:'MIT College of Engineering', type:'text'     },
              { k:'adminName', label:'Admin Name *',   ph:'Your full name',             type:'text'     },
              { k:'email',     label:'Email *',        ph:'admin@college.edu',          type:'email'    },
              { k:'password',  label:'Password *',     ph:'Create a strong password',   type:'password' },
            ].map(({ k, label, ph, type }) => (
              <div key={k}>
                <label className="block mb-1.5" style={lbl}>{label}</label>
                <input className="input-dark" type={type} placeholder={ph} value={form[k]} onChange={set(k)} required/>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1.5" style={lbl}>Phone</label>
                <input className="input-dark" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={set('phone')}/>
              </div>
              <div>
                <label className="block mb-1.5" style={lbl}>Address</label>
                <input className="input-dark" placeholder="City, State" value={form.address} onChange={set('address')}/>
              </div>
            </div>
            <button type="submit" className="btn-primary w-full mt-2">Register College</button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color:'var(--text3)' }}>
            Already registered?{' '}
            <button onClick={() => navigate('/select-college')}
              style={{ color:'var(--p)', fontWeight:600 }}
              onMouseEnter={e => e.currentTarget.style.textDecoration='underline'}
              onMouseLeave={e => e.currentTarget.style.textDecoration='none'}>
              Select College
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

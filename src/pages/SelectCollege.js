import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Search, ArrowRight, Plus, MapPin, Loader2 } from 'lucide-react';

const API = 'http://localhost:5000/api';

export default function SelectCollege() {
  const [colleges, setColleges] = useState([]);
  const [search, setSearch]     = useState('');
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/colleges`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setColleges(data);
        else setError('Failed to load colleges');
      })
      .catch(() => setError('Cannot connect to server. Make sure backend is running.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = colleges.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background:'var(--bg)' }}>
      <div style={{ position:'absolute', top:'-10%', left:'-5%', width:'500px', height:'500px', borderRadius:'50%', background:'radial-gradient(circle, rgba(34,197,94,0.08), transparent 70%)', filter:'blur(40px)', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', bottom:'-10%', right:'-5%', width:'500px', height:'500px', borderRadius:'50%', background:'radial-gradient(circle, rgba(212,175,55,0.07), transparent 70%)', filter:'blur(40px)', pointerEvents:'none' }}/>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">

        {/* Header */}
        <motion.div className="text-center mb-12" initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background:'linear-gradient(135deg,#22C55E,#15803D)', boxShadow:'0 8px 24px rgba(34,197,94,0.30)' }}>
            <GraduationCap size={28} color="#fff"/>
          </div>
          <h1 className="gradient-text" style={{ fontWeight:900, fontSize:'2rem', marginBottom:'0.5rem' }}>
            Select Your College
          </h1>
          <p style={{ color:'var(--text3)' }}>Choose your institution to continue</p>
        </motion.div>

        {/* Search */}
        <motion.div className="relative mb-8" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:.1 }}>
          <Search size={16} style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'var(--text4)', pointerEvents:'none' }}/>
          <input className="input-dark input-icon-left" placeholder="Search colleges..." value={search} onChange={e => setSearch(e.target.value)}/>
        </motion.div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl text-sm text-center"
            style={{ background:'rgba(239,68,68,0.10)', border:'1px solid rgba(239,68,68,0.25)', color:'#DC2626' }}>
            ⚠ {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16 gap-3" style={{ color:'var(--text3)' }}>
            <Loader2 size={20} className="animate-spin" style={{ color:'var(--p)' }}/>
            <span style={{ fontSize:'0.875rem' }}>Loading colleges...</span>
          </div>
        )}

        {/* College cards */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            {filtered.map((c, i) => (
              <motion.div key={c.id}
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*.06 }}
                whileHover={{ y:-3 }}
                style={{ background:'var(--bg3)', border:'1px solid var(--border2)', borderRadius:'18px', padding:'1.5rem', boxShadow:'var(--shadow)', transition:'all .25s ease', cursor:'none' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(34,197,94,0.35)'; e.currentTarget.style.boxShadow='var(--shadow-h)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border2)'; e.currentTarget.style.boxShadow='var(--shadow)'; }}>

                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background:'rgba(34,197,94,0.12)' }}>
                    <GraduationCap size={20} style={{ color:'var(--p)' }}/>
                  </div>
                  <ArrowRight size={16} style={{ color:'var(--text4)' }}/>
                </div>

                <h3 style={{ color:'var(--text1)', fontWeight:700, fontSize:'1rem', marginBottom:'0.25rem' }}>{c.name}</h3>
                {c.address && (
                  <p className="flex items-center gap-1.5 mb-5" style={{ color:'var(--text3)', fontSize:'0.82rem' }}>
                    <MapPin size={12}/>{c.address}
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/login?college=${c.id}&name=${encodeURIComponent(c.name)}`)}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                    style={{ border:'1px solid rgba(34,197,94,0.30)', color:'var(--p)', background:'transparent' }}
                    onMouseEnter={e => { e.currentTarget.style.background='rgba(34,197,94,0.10)'; e.currentTarget.style.borderColor='rgba(34,197,94,0.50)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='rgba(34,197,94,0.30)'; }}>
                    Admin Login
                  </button>
                  <button
                    onClick={() => navigate(`/student/login?college=${c.id}&name=${encodeURIComponent(c.name)}`)}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                    style={{ border:'1px solid rgba(212,175,55,0.30)', color:'var(--s)', background:'transparent' }}
                    onMouseEnter={e => { e.currentTarget.style.background='rgba(212,175,55,0.10)'; e.currentTarget.style.borderColor='rgba(212,175,55,0.50)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='rgba(212,175,55,0.30)'; }}>
                    Student Login
                  </button>
                </div>
              </motion.div>
            ))}

            {!loading && filtered.length === 0 && !error && (
              <div className="col-span-2 text-center py-14" style={{ color:'var(--text3)' }}>
                <GraduationCap size={40} style={{ margin:'0 auto 12px', opacity:.3 }}/>
                <p style={{ fontSize:'0.875rem' }}>No colleges found</p>
              </div>
            )}
          </div>
        )}

        {/* Register new */}
        {!loading && (
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.3 }}
            whileHover={{ y:-2 }}
            onClick={() => navigate('/register-college')}
            style={{ background:'var(--bg3)', border:`1.5px dashed var(--border2)`, borderRadius:'18px', padding:'1.5rem', textAlign:'center', cursor:'none', transition:'all .25s ease' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(34,197,94,0.40)'; e.currentTarget.style.background='rgba(34,197,94,0.04)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border2)'; e.currentTarget.style.background='var(--bg3)'; }}>
            <Plus size={22} style={{ color:'var(--p)', margin:'0 auto 8px' }}/>
            <p style={{ color:'var(--text1)', fontWeight:600, fontSize:'0.9rem' }}>Register New College</p>
            <p style={{ color:'var(--text3)', fontSize:'0.8rem', marginTop:'4px' }}>Add your institution to ScholrERP</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

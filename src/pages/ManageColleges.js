import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, MapPin, Phone, Mail, Plus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api';

export default function ManageColleges() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  const load = () => {
    setLoading(true);
    fetch(`${API}/colleges`)
      .then(r => r.json())
      .then(data => { setColleges(Array.isArray(data) ? data : []); setError(''); })
      .catch(() => setError('Cannot connect to server.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ color:'var(--text1)', fontWeight:900, fontSize:'1.4rem' }}>Manage Colleges</h1>
          <p style={{ color:'var(--text3)', fontSize:'0.8rem' }} className="mt-0.5">
            {colleges.length} college{colleges.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        <button onClick={() => navigate('/register-college')} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={15}/> Add College
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 p-3 rounded-xl text-sm flex items-center gap-2"
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {colleges.map((c, i) => {
            const isOwn = c.id === user?.college_id;
            return (
              <motion.div key={c.id}
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*.06 }}
                style={{ background:'var(--bg3)', border:`1px solid ${isOwn ? 'rgba(34,197,94,0.30)' : 'var(--border2)'}`, borderRadius:'18px', padding:'1.5rem', boxShadow:'var(--shadow)', position:'relative', overflow:'hidden' }}>

                {/* Own college badge */}
                {isOwn && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{ background:'rgba(34,197,94,0.12)', color:'var(--p)', border:'1px solid rgba(34,197,94,0.25)' }}>
                    Your College
                  </span>
                )}

                {/* Icon + Name */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background:'rgba(34,197,94,0.12)' }}>
                    <GraduationCap size={20} style={{ color:'var(--p)' }}/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 style={{ color:'var(--text1)', fontWeight:700, fontSize:'0.95rem' }} className="truncate">{c.name}</h3>
                    <p style={{ color:'var(--text3)', fontSize:'0.75rem' }}>ID: #{c.id}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2" style={{ color:'var(--text3)', fontSize:'0.78rem' }}>
                    <Mail size={12} style={{ color:'var(--p)', flexShrink:0 }}/>{c.email}
                  </div>
                  {c.address && (
                    <div className="flex items-center gap-2" style={{ color:'var(--text3)', fontSize:'0.78rem' }}>
                      <MapPin size={12} style={{ color:'var(--s)', flexShrink:0 }}/>{c.address}
                    </div>
                  )}
                  {c.phone && (
                    <div className="flex items-center gap-2" style={{ color:'var(--text3)', fontSize:'0.78rem' }}>
                      <Phone size={12} style={{ color:'var(--text4)', flexShrink:0 }}/>{c.phone}
                    </div>
                  )}
                </div>


              </motion.div>
            );
          })}

          {!loading && colleges.length === 0 && (
            <div className="col-span-3 text-center py-14" style={{ color:'var(--text3)' }}>
              <GraduationCap size={40} style={{ margin:'0 auto 12px', opacity:.3 }}/>
              <p style={{ fontSize:'0.875rem' }}>No colleges found</p>
            </div>
          )}
        </div>
      )}


    </DashboardLayout>
  );
}

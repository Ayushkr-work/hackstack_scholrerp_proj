import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Search, ArrowRight, Plus, MapPin } from 'lucide-react';
import { getColleges } from '../utils/mockData';
import { useTheme } from '../context/ThemeContext';

export default function SelectCollege() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const colleges = getColleges();
  const filtered = colleges.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>

      {/* Background blobs — theme-aware */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-8%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: isDark
          ? 'radial-gradient(circle, rgba(59,130,246,0.12), transparent 70%)'
          : 'radial-gradient(circle, rgba(59,130,246,0.10), transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }}/>
      <div style={{
        position: 'absolute', bottom: '-10%', right: '-8%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: isDark
          ? 'radial-gradient(circle, rgba(139,92,246,0.10), transparent 70%)'
          : 'radial-gradient(circle, rgba(16,185,129,0.08), transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }}/>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">

        {/* Header */}
        <motion.div className="text-center mb-12"
          initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}>
          <motion.div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)', boxShadow: '0 8px 24px rgba(59,130,246,0.30)' }}
            whileHover={{ scale:1.08, rotate:4 }}>
            <GraduationCap size={28} color="#fff"/>
          </motion.div>
          <h1 className="text-4xl font-black gradient-text mb-2">Select Your College</h1>
          <p style={{ color:'var(--text3)' }}>Choose your institution to continue</p>
        </motion.div>

        {/* Search */}
        <div className="relative mb-8">
          <Search size={16} style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'var(--text4)', pointerEvents:'none' }}/>
          <input
            className="input-dark input-icon-left"
            placeholder="Search colleges..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* College cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {filtered.map((c, i) => (
            <motion.div key={c.id}
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*.06 }}
              whileHover={{ y:-4 }}
              style={{
                background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.80)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'}`,
                borderRadius: '18px',
                padding: '1.5rem',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: isDark
                  ? '0 4px 24px rgba(0,0,0,0.30)'
                  : '0 4px 24px rgba(0,0,0,0.07)',
                cursor: 'none',
                transition: 'box-shadow .25s ease, border-color .25s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(59,130,246,0.35)';
                e.currentTarget.style.boxShadow = isDark
                  ? '0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(59,130,246,0.2)'
                  : '0 12px 40px rgba(59,130,246,0.12)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';
                e.currentTarget.style.boxShadow = isDark ? '0 4px 24px rgba(0,0,0,0.30)' : '0 4px 24px rgba(0,0,0,0.07)';
              }}>

              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: isDark ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.10)' }}>
                  <GraduationCap size={20} style={{ color:'var(--p)' }}/>
                </div>
                <ArrowRight size={16} style={{ color:'var(--text4)', transition:'color .2s, transform .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.color='var(--p)'; e.currentTarget.style.transform='translateX(3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color='var(--text4)'; e.currentTarget.style.transform='translateX(0)'; }}
                />
              </div>

              <h3 className="font-bold text-base mb-1" style={{ color:'var(--text1)' }}>{c.name}</h3>

              <p className="text-sm flex items-center gap-1.5 mb-5" style={{ color:'var(--text3)' }}>
                <MapPin size={12}/>{c.address}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/admin/login?college=${c.id}&name=${encodeURIComponent(c.name)}`)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={{ border:'1px solid rgba(59,130,246,0.30)', color:'var(--p)', background:'transparent' }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(59,130,246,0.10)'; e.currentTarget.style.borderColor='rgba(59,130,246,0.50)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='rgba(59,130,246,0.30)'; }}>
                  Admin Login
                </button>
                <button
                  onClick={() => navigate(`/student/login?college=${c.id}&name=${encodeURIComponent(c.name)}`)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={{ border:'1px solid rgba(16,185,129,0.30)', color:'var(--s)', background:'transparent' }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(16,185,129,0.10)'; e.currentTarget.style.borderColor='rgba(16,185,129,0.50)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='rgba(16,185,129,0.30)'; }}>
                  Student Login
                </button>
              </div>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-2 text-center py-16" style={{ color:'var(--text3)' }}>
              <GraduationCap size={40} style={{ margin:'0 auto 12px', opacity:.3 }}/>
              <p className="font-medium">No colleges found</p>
            </div>
          )}
        </div>

        {/* Register new college card */}
        <motion.div
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.3 }}
          whileHover={{ y:-3 }}
          onClick={() => navigate('/register-college')}
          style={{
            background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.65)',
            border: `1.5px dashed ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
            borderRadius: '18px',
            padding: '1.5rem',
            textAlign: 'center',
            cursor: 'none',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            transition: 'all .25s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(59,130,246,0.40)';
            e.currentTarget.style.background = isDark ? 'rgba(59,130,246,0.06)' : 'rgba(59,130,246,0.05)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(59,130,246,0.10)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)';
            e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.65)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
          <motion.div whileHover={{ scale:1.15, rotate:8 }} style={{ display:'inline-block', marginBottom:'8px' }}>
            <Plus size={22} style={{ color:'var(--p)' }}/>
          </motion.div>
          <p className="font-semibold text-sm" style={{ color:'var(--text1)' }}>Register New College</p>
          <p className="text-xs mt-1" style={{ color:'var(--text3)' }}>Add your institution to ScholrERP</p>
        </motion.div>

      </div>
    </div>
  );
}

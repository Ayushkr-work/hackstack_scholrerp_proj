import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Loader2 } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const gradeStyle = g => {
  if (!g) return { color:'var(--text3)' };
  if (['O','A+','A'].includes(g)) return { color:'#15803D', fontWeight:700 };
  if (['B+','B'].includes(g))     return { color:'#22C55E', fontWeight:700 };
  if (['C+','C'].includes(g))     return { color:'#D97706', fontWeight:700 };
  return { color:'#DC2626', fontWeight:700 };
};
const th  = { color:'var(--text3)', fontSize:'0.7rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em' };

export default function ResultsPage() {
  const { role, user } = useAuth();
  const [students, setStudents]     = useState([]);
  const [selStudent, setSelStudent] = useState(role === 'student' ? String(user?.id) : '');
  const [results, setResults]       = useState([]);
  const [loading, setLoading]       = useState(false);

  useEffect(() => {
    if (role === 'admin') api.get('/students').then(d => setStudents(Array.isArray(d) ? d : [])).catch(() => {});
    if (role === 'student') loadResults(user?.id);
  }, [role]);

  const loadResults = sid => {
    if (!sid) return;
    setLoading(true);
    const path = role === 'student' ? '/results/my' : `/results/student/${sid}`;
    api.get(path).then(d => setResults(Array.isArray(d) ? d : [])).catch(() => {}).finally(() => setLoading(false));
  };

  const onSelectStudent = sid => { setSelStudent(sid); loadResults(sid); };

  const bySem = results.reduce((acc, r) => { (acc[r.semester]||(acc[r.semester]=[])).push(r); return acc; }, {});

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ color:'var(--text1)', fontWeight:900, fontSize:'1.4rem' }}>Results</h1>
          <p style={{ color:'var(--text3)', fontSize:'0.8rem' }} className="mt-0.5">Semester-wise academic results</p>
        </div>
      </div>

      {role==='admin' && (
        <div className="mb-6">
          <select className="input-dark max-w-xs" value={selStudent} onChange={e => onSelectStudent(e.target.value)}>
            <option value="">Select a student...</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.roll_no})</option>)}
          </select>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 size={22} className="animate-spin" style={{ color:'var(--p)' }}/></div>
      ) : Object.keys(bySem).length === 0 ? (
        <div className="rounded-2xl p-14 text-center" style={{ background:'var(--bg3)', border:'1px solid var(--border2)', boxShadow:'var(--shadow)' }}>
          <FileText size={40} style={{ margin:'0 auto 12px', color:'var(--text4)' }}/>
          <p style={{ color:'var(--text3)', fontSize:'0.85rem' }}>{role==='admin'?'Select a student to view results':'No results available yet'}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(bySem).map(([sem, rows]) => {
            const avg = Math.round(rows.reduce((a,r)=>a+(r.marks/r.max_marks)*100,0)/rows.length);
            return (
              <motion.div key={sem} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                style={{ background:'var(--bg3)', border:'1px solid var(--border2)', borderRadius:'16px', overflow:'hidden', boxShadow:'var(--shadow)' }}>
                <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom:'1px solid var(--border2)', background:'var(--bg4)' }}>
                  <h2 style={{ color:'var(--text1)', fontWeight:700 }}>Semester {sem}</h2>
                  <span style={{ color:'var(--text3)', fontSize:'0.85rem' }}>Avg: <span style={{ fontWeight:700, color:avg>=75?'#15803D':avg>=50?'#D97706':'#DC2626' }}>{avg}%</span></span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr style={{ borderBottom:'1px solid var(--border2)' }}>{['Subject','Marks','Max','Percentage','Grade'].map(h=><th key={h} className="text-left px-6 py-3" style={th}>{h}</th>)}</tr></thead>
                    <tbody>
                      {rows.map((r,i) => (
                        <tr key={i} style={{ borderBottom:'1px solid var(--border2)', transition:'background .15s' }}
                          onMouseEnter={e=>e.currentTarget.style.background='rgba(34,197,94,0.04)'}
                          onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                          <td className="px-6 py-3" style={{ color:'var(--text1)', fontWeight:600, fontSize:'0.875rem' }}>{r.subject}</td>
                          <td className="px-6 py-3" style={{ color:'var(--text2)', fontSize:'0.875rem' }}>{r.marks}</td>
                          <td className="px-6 py-3" style={{ color:'var(--text3)', fontSize:'0.875rem' }}>{r.max_marks}</td>
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-1.5 rounded-full" style={{ background:'var(--bg5)' }}>
                                <div className="h-full rounded-full" style={{ width:`${(r.marks/r.max_marks)*100}%`, background:'linear-gradient(90deg,#22C55E,#D4AF37)' }}/>
                              </div>
                              <span style={{ color:'var(--text2)', fontSize:'0.8rem' }}>{Math.round((r.marks/r.max_marks)*100)}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-3" style={gradeStyle(r.grade)}>{r.grade||'—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}

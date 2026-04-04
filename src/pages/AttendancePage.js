import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, AlertTriangle, CheckCircle } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { getAttendance } from '../utils/api';

const f = (i) => ({ initial:{opacity:0,y:16}, animate:{opacity:1,y:0}, transition:{delay:i*.06,duration:.3,ease:'easeOut'} });

function pctColor(p) {
  if (p >= 75) return '#22C55E';
  if (p >= 60) return '#F59E0B';
  return '#EF4444';
}

export default function AttendancePage() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [semFilter, setSem]   = useState('all');

  useEffect(() => {
    getAttendance()
      .then(d => setData(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const semesters = [...new Set(data.map(r => r.semester))].sort((a,b)=>a-b);
  const filtered  = semFilter === 'all' ? data : data.filter(r => r.semester == semFilter);

  const overall = filtered.length
    ? Math.round(filtered.reduce((s,r) => s + r.percentage, 0) / filtered.length)
    : 0;

  const low = filtered.filter(r => r.percentage < 75);

  return (
    <DashboardLayout>
      <motion.div {...f(0)} className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background:'rgba(34,197,94,0.12)' }}>
          <ClipboardList size={20} style={{ color:'#22C55E' }}/>
        </div>
        <div>
          <h1 className="text-xl font-black" style={{ color:'var(--text1)' }}>Attendance</h1>
          <p className="text-xs" style={{ color:'var(--text3)' }}>Subject-wise attendance tracker</p>
        </div>
      </motion.div>

      {/* Semester filter */}
      <motion.div {...f(1)} className="flex flex-wrap gap-2 mb-6">
        {['all', ...semesters].map(s => (
          <button key={s} onClick={() => setSem(s)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{
              background: semFilter == s ? '#22C55E' : 'var(--bg4)',
              color:      semFilter == s ? '#fff'    : 'var(--text2)',
              border:     `1px solid ${semFilter == s ? '#22C55E' : 'var(--border2)'}`,
            }}>
            {s === 'all' ? 'All Semesters' : `Sem ${s}`}
          </button>
        ))}
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <motion.div {...f(2)} className="card-flat p-4 text-center">
          <p className="text-2xl font-black" style={{ color: pctColor(overall) }}>{overall}%</p>
          <p className="text-xs mt-1" style={{ color:'var(--text3)' }}>Overall Avg</p>
        </motion.div>
        <motion.div {...f(3)} className="card-flat p-4 text-center">
          <p className="text-2xl font-black" style={{ color:'#22C55E' }}>{filtered.filter(r=>r.percentage>=75).length}</p>
          <p className="text-xs mt-1" style={{ color:'var(--text3)' }}>Subjects ≥75%</p>
        </motion.div>
        <motion.div {...f(4)} className="card-flat p-4 text-center col-span-2 sm:col-span-1">
          <p className="text-2xl font-black" style={{ color: low.length ? '#EF4444' : '#22C55E' }}>{low.length}</p>
          <p className="text-xs mt-1" style={{ color:'var(--text3)' }}>Below 75%</p>
        </motion.div>
      </div>

      {/* Low attendance warning */}
      {low.length > 0 && (
        <motion.div {...f(5)} className="flex items-start gap-3 p-4 rounded-xl mb-6"
          style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.20)' }}>
          <AlertTriangle size={16} style={{ color:'#EF4444', marginTop:1, flexShrink:0 }}/>
          <div>
            <p className="text-xs font-bold" style={{ color:'#EF4444' }}>Low Attendance Warning</p>
            <p className="text-xs mt-0.5" style={{ color:'var(--text3)' }}>
              {low.map(r => r.subject).join(', ')} — below 75% threshold
            </p>
          </div>
        </motion.div>
      )}

      {/* Subject cards */}
      {loading ? (
        <div className="text-center py-16 text-sm" style={{ color:'var(--text3)' }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-sm" style={{ color:'var(--text3)' }}>No attendance records found</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((row, i) => {
            const color = pctColor(row.percentage);
            return (
              <motion.div key={i} {...f(i + 6)} className="card-flat p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {row.percentage >= 75
                      ? <CheckCircle size={14} style={{ color:'#22C55E' }}/>
                      : <AlertTriangle size={14} style={{ color: color }}/>
                    }
                    <span className="text-sm font-semibold" style={{ color:'var(--text1)' }}>{row.subject}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background:'var(--bg4)', color:'var(--text3)' }}>
                      Sem {row.semester}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black" style={{ color }}>{row.percentage}%</span>
                    <p className="text-[10px]" style={{ color:'var(--text3)' }}>{row.attended}/{row.total_classes} classes</p>
                  </div>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background:'var(--bg4)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: color }}
                    initial={{ width:0 }}
                    animate={{ width:`${row.percentage}%` }}
                    transition={{ duration:.6, delay: i*.05, ease:'easeOut' }}
                  />
                </div>
                {row.percentage < 75 && (
                  <p className="text-[10px] mt-1.5" style={{ color:'#EF4444' }}>
                    Need {Math.ceil((0.75 * row.total_classes - row.attended) / 0.25)} more classes to reach 75%
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}

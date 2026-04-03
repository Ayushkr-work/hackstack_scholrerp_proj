import { motion } from 'framer-motion';
import { ShieldCheck, Clock, User } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { getPasswordResetLogs, getStudents } from '../utils/mockData';
import { useAuth } from '../context/AuthContext';

export default function PasswordResetLogs() {
  const { user } = useAuth();
  const cid = user?.college_id;
  const myStudents = getStudents(cid);
  const logs = getPasswordResetLogs().filter(l => myStudents.find(s => s.id === l.student_id));

  return (
    <DashboardLayout>
      <motion.div className="mb-6" initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}>
        <h1 style={{ color:'var(--text1)', fontWeight:900, fontSize:'1.4rem' }}>Password Reset Logs</h1>
        <p style={{ color:'var(--text3)', fontSize:'0.8rem' }} className="mt-0.5">
          {logs.length} password reset{logs.length !== 1 ? 's' : ''} recorded
        </p>
      </motion.div>

      {logs.length === 0 ? (
        <div className="rounded-2xl p-14 text-center"
          style={{ background:'var(--bg3)', border:'1px solid var(--border2)', boxShadow:'var(--shadow)' }}>
          <ShieldCheck size={44} style={{ margin:'0 auto 12px', color:'var(--text4)' }}/>
          <p style={{ color:'var(--text2)', fontWeight:500, fontSize:'0.9rem' }}>No password resets yet</p>
          <p style={{ color:'var(--text3)', fontSize:'0.8rem', marginTop:'4px' }}>
            When students reset their passwords, it will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log, i) => (
            <motion.div key={log.id}
              className="flex items-center gap-4 p-5 rounded-2xl"
              style={{ background:'var(--bg3)', border:'1px solid var(--border2)', boxShadow:'var(--shadow)', transition:'box-shadow .2s, border-color .2s' }}
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*.05 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.boxShadow='var(--shadow-h)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border2)'; e.currentTarget.style.boxShadow='var(--shadow)'; }}>

              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background:'rgba(34,197,94,0.12)' }}>
                <ShieldCheck size={18} style={{ color:'var(--p)' }}/>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <span className="flex items-center gap-1.5 font-semibold text-sm"
                    style={{ color:'var(--text1)' }}>
                    <User size={13} style={{ color:'var(--p)' }}/> {log.student_name}
                  </span>
                  <span style={{ color:'var(--text3)', fontSize:'0.82rem' }}>{log.email}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                    style={{ background:'rgba(34,197,94,0.12)', color:'#15803D', border:'1px solid rgba(34,197,94,0.25)' }}>
                    Password Changed
                  </span>
                </div>
                <div className="flex items-center gap-1.5" style={{ color:'var(--text4)', fontSize:'0.72rem' }}>
                  <Clock size={11}/>
                  {new Date(log.reset_at).toLocaleString('en-IN', {
                    day:'numeric', month:'short', year:'numeric',
                    hour:'2-digit', minute:'2-digit'
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

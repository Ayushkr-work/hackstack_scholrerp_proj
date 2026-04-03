import { motion } from 'framer-motion';
import { ShieldCheck, Clock, User } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { getPasswordResetLogs, getStudents } from '../utils/mockData';
import { useAuth } from '../context/AuthContext';

export default function PasswordResetLogs() {
  const { user } = useAuth();
  const cid = user?.college_id;
  const myStudents = getStudents(cid);
  const allLogs = getPasswordResetLogs();
  // filter to only this college's students
  const logs = allLogs.filter(l => myStudents.find(s => s.id === l.student_id));

  return (
    <DashboardLayout>
      <motion.div className="mb-6" initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}>
        <h1 className="text-2xl font-black text-white">Password Reset Logs</h1>
        <p className="text-white/40 text-sm">{logs.length} password reset{logs.length !== 1 ? 's' : ''} recorded</p>
      </motion.div>

      {logs.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center border border-white/5">
          <ShieldCheck size={48} className="mx-auto mb-3 text-white/20"/>
          <p className="text-white/30">No password resets yet</p>
          <p className="text-white/20 text-sm mt-1">When students reset their passwords, it will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log, i) => (
            <motion.div key={log.id}
              className="glass rounded-2xl p-5 border border-white/5 flex items-center gap-4"
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*.05 }}>
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center shrink-0">
                <ShieldCheck size={18} className="text-green-400"/>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <User size={14} className="text-cyan-400"/> {log.student_name}
                  </span>
                  <span className="text-white/40 text-sm">{log.email}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                    Password Changed
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-white/30 text-xs">
                  <Clock size={12}/>
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

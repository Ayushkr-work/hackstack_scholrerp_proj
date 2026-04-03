import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeadphonesIcon, Clock, CheckCircle, AlertCircle, MessageSquare, ChevronDown, ChevronUp, Tag, User, Send } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { getTickets, updateTicket, getStudents } from '../utils/mockData';

const statusCfg = {
  open:         { label: 'Open',        cls: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',  dot: 'bg-yellow-400' },
  'in-progress':{ label: 'In Progress', cls: 'bg-blue-500/20 text-blue-400 border-blue-500/30',        dot: 'bg-blue-400'   },
  resolved:     { label: 'Resolved',    cls: 'bg-green-500/20 text-green-400 border-green-500/30',     dot: 'bg-green-400'  },
};

const priorityCfg = {
  low:    { cls: 'bg-white/10 text-white/50',          label: 'Low'    },
  medium: { cls: 'bg-yellow-500/20 text-yellow-400',   label: 'Medium' },
  high:   { cls: 'bg-red-500/20 text-red-400',         label: 'High'   },
};

export default function AdminHelpdeskPage() {
  const { user } = useAuth();
  const cid = user?.college_id;
  const myStudents = getStudents(cid);

  const [tickets, setTickets]   = useState(() => getTickets().filter(t => t.college_id === cid));
  const [expanded, setExpanded] = useState(null);
  const [replyModal, setReplyModal] = useState(null);
  const [filter, setFilter]     = useState('all');
  const [reply, setReply]       = useState('');
  const [newStatus, setNewStatus] = useState('in-progress');

  const refresh = () => setTickets(getTickets().filter(t => t.college_id === cid));

  const submitReply = () => {
    if (!reply.trim()) return;
    updateTicket(replyModal.id, {
      admin_reply: reply,
      status: newStatus,
      resolved_at: newStatus === 'resolved' ? new Date().toISOString() : null,
    });
    refresh();
    setReplyModal(null);
    setReply('');
    setNewStatus('in-progress');
  };

  const markResolved = (id) => {
    updateTicket(id, { status: 'resolved', resolved_at: new Date().toISOString() });
    refresh();
  };

  const displayed = filter === 'all' ? tickets : tickets.filter(t => t.status === filter);

  const stats = {
    total:    tickets.length,
    open:     tickets.filter(t => t.status === 'open').length,
    progress: tickets.filter(t => t.status === 'in-progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <HeadphonesIcon size={26} className="text-cyan-400"/> Helpdesk
          </h1>
          <p className="text-white/40 text-sm mt-0.5">Manage and resolve student support tickets</p>
        </div>
        {stats.open > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"/>
            <span className="text-yellow-400 text-sm font-medium">{stats.open} open ticket{stats.open > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Tickets', value: stats.total,    color: 'from-white/10 to-white/5',           tc: 'text-white'      },
          { label: 'Open',          value: stats.open,     color: 'from-yellow-500/20 to-yellow-500/5',  tc: 'text-yellow-400' },
          { label: 'In Progress',   value: stats.progress, color: 'from-blue-500/20 to-blue-500/5',      tc: 'text-blue-400'   },
          { label: 'Resolved',      value: stats.resolved, color: 'from-green-500/20 to-green-500/5',    tc: 'text-green-400'  },
        ].map(({ label, value, color, tc }, i) => (
          <motion.div key={i} className={`glass rounded-2xl p-4 border border-white/5 bg-gradient-to-br ${color}`}
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*.06 }}>
            <p className={`text-2xl font-black ${tc}`}>{value}</p>
            <p className="text-white/40 text-xs mt-1">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'open', 'in-progress', 'resolved'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize
              ${filter === f ? 'btn-primary' : 'glass border border-white/10 text-white/50 hover:text-white'}`}>
            {f === 'all' ? 'All Tickets' : f === 'in-progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== 'all' && (
              <span className="ml-2 px-1.5 py-0.5 rounded-full text-xs bg-white/10">
                {f === 'open' ? stats.open : f === 'in-progress' ? stats.progress : stats.resolved}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Ticket list */}
      {displayed.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center border border-white/5">
          <HeadphonesIcon size={48} className="mx-auto mb-3 text-white/20"/>
          <p className="text-white/30 font-medium">No tickets found</p>
          <p className="text-white/20 text-sm mt-1">Student tickets will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((t, i) => {
            const sc = statusCfg[t.status] || statusCfg.open;
            const pc = priorityCfg[t.priority] || priorityCfg.medium;
            const isOpen = expanded === t.id;
            return (
              <motion.div key={t.id} className={`glass rounded-2xl border overflow-hidden transition-all ${t.status==='open'?'border-yellow-500/20':'border-white/5'}`}
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*.04 }}>

                {/* Ticket header */}
                <button className="w-full text-left p-5 flex items-start gap-4 hover:bg-white/3 transition-colors"
                  onClick={() => setExpanded(isOpen ? null : t.id)}>
                  {/* Priority indicator */}
                  <div className={`w-1 self-stretch rounded-full shrink-0 ${t.priority==='high'?'bg-red-500':t.priority==='medium'?'bg-yellow-500':'bg-white/20'}`}/>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className="text-white/30 text-xs font-mono">#{t.id}</span>
                      <p className="font-semibold text-white text-sm">{t.subject}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${sc.cls}`}>
                        <span className={`inline-block w-1.5 h-1.5 rounded-full ${sc.dot} mr-1.5`}/>{sc.label}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${pc.cls}`}>{pc.label}</span>
                      <span className="flex items-center gap-1 text-xs text-white/30"><Tag size={11}/>{t.category}</span>
                      <span className="flex items-center gap-1 text-xs text-white/30"><User size={11}/>{t.student_name} ({t.roll_no})</span>
                      <span className="text-xs text-white/20">{new Date(t.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</span>
                    </div>
                  </div>
                  <div className="shrink-0 text-white/30 mt-1">
                    {isOpen ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                  </div>
                </button>

                {/* Expanded */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
                      exit={{ height:0, opacity:0 }} transition={{ duration:.25 }}
                      className="overflow-hidden">
                      <div className="px-5 pb-5 space-y-4 border-t border-white/10 pt-4">
                        {/* Student description */}
                        <div>
                          <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-2">Student's Issue</p>
                          <p className="text-white/70 text-sm leading-relaxed bg-white/5 rounded-xl p-3 border border-white/10">{t.description}</p>
                        </div>

                        {/* Existing reply */}
                        {t.admin_reply && (
                          <div>
                            <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <MessageSquare size={12}/> Your Response
                            </p>
                            <div className="bg-cyan-500/10 rounded-xl p-3 border border-cyan-500/20">
                              <p className="text-white/80 text-sm leading-relaxed">{t.admin_reply}</p>
                            </div>
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex items-center gap-3 flex-wrap pt-1">
                          {t.status !== 'resolved' && (
                            <>
                              <button onClick={() => { setReplyModal(t); setNewStatus(t.status === 'open' ? 'in-progress' : t.status); }}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20 transition-colors text-sm font-medium">
                                <Send size={14}/> {t.admin_reply ? 'Update Reply' : 'Reply'}
                              </button>
                              <button onClick={() => markResolved(t.id)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 transition-colors text-sm font-medium">
                                <CheckCircle size={14}/> Mark Resolved
                              </button>
                            </>
                          )}
                          {t.status === 'resolved' && (
                            <div className="flex items-center gap-2 text-green-400 text-sm">
                              <CheckCircle size={16}/>
                              Resolved on {new Date(t.resolved_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Reply Modal */}
      <Modal open={!!replyModal} onClose={() => { setReplyModal(null); setReply(''); }} title="Reply to Ticket" size="md">
        {replyModal && (
          <div className="space-y-4">
            {/* Ticket info */}
            <div className="glass rounded-xl p-4 border border-white/10">
              <p className="text-xs text-white/40 mb-1">Ticket #{replyModal.id} — {replyModal.student_name}</p>
              <p className="text-white font-semibold text-sm">{replyModal.subject}</p>
              <p className="text-white/50 text-xs mt-1 line-clamp-2">{replyModal.description}</p>
            </div>

            {/* Status update */}
            <div>
              <label className="text-xs text-white/50 font-medium mb-1.5 block">Update Status</label>
              <div className="flex gap-2">
                {['in-progress', 'resolved'].map(s => (
                  <button key={s} onClick={() => setNewStatus(s)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all capitalize
                      ${newStatus === s
                        ? s === 'resolved' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        : 'bg-white/5 text-white/40 border-white/10 hover:text-white'}`}>
                    {s === 'in-progress' ? 'In Progress' : 'Resolved'}
                  </button>
                ))}
              </div>
            </div>

            {/* Reply text */}
            <div>
              <label className="text-xs text-white/50 font-medium mb-1.5 block">Your Reply *</label>
              <textarea className="input-dark resize-none" rows={5}
                placeholder="Type your response to the student..."
                value={reply}
                onChange={e => setReply(e.target.value)}
                defaultValue={replyModal.admin_reply}
              />
            </div>

            <button onClick={submitReply} disabled={!reply.trim()}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
              <Send size={16}/>
              {newStatus === 'resolved' ? 'Reply & Mark Resolved' : 'Send Reply'}
            </button>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, HeadphonesIcon, Clock, CheckCircle, AlertCircle, MessageSquare, ChevronDown, ChevronUp, Tag } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { getTickets, addTicket } from '../utils/mockData';

const CATEGORIES = ['Academic', 'Fees', 'Technical', 'Library', 'Hostel', 'Placement', 'Other'];
const PRIORITIES  = ['low', 'medium', 'high'];

const statusCfg = {
  open:        { label: 'Open',        cls: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',  icon: Clock        },
  'in-progress':{ label: 'In Progress', cls: 'bg-blue-500/20 text-blue-400 border-blue-500/30',       icon: AlertCircle  },
  resolved:    { label: 'Resolved',    cls: 'bg-green-500/20 text-green-400 border-green-500/30',     icon: CheckCircle  },
};

const priorityCfg = {
  low:    'bg-white/10 text-white/50',
  medium: 'bg-yellow-500/20 text-yellow-400',
  high:   'bg-red-500/20 text-red-400',
};

export default function HelpdeskPage() {
  const { user } = useAuth();
  const [tickets, setTickets]   = useState(() => getTickets().filter(t => t.student_id === user?.id));
  const [modal, setModal]       = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter]     = useState('all');
  const [form, setForm]         = useState({ subject: '', category: 'Academic', priority: 'medium', description: '' });
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const refresh = () => setTickets(getTickets().filter(t => t.student_id === user?.id));

  const submit = e => {
    e.preventDefault();
    addTicket({ ...form, student_id: user?.id, student_name: user?.name, roll_no: user?.roll_no, college_id: user?.college_id });
    refresh();
    setModal(false);
    setForm({ subject: '', category: 'Academic', priority: 'medium', description: '' });
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
          <p className="text-white/40 text-sm mt-0.5">Raise issues and track their resolution</p>
        </div>
        <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16}/> Raise Ticket
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total',       value: stats.total,    color: 'from-white/10 to-white/5',          tc: 'text-white'        },
          { label: 'Open',        value: stats.open,     color: 'from-yellow-500/20 to-yellow-500/5', tc: 'text-yellow-400'   },
          { label: 'In Progress', value: stats.progress, color: 'from-blue-500/20 to-blue-500/5',     tc: 'text-blue-400'     },
          { label: 'Resolved',    value: stats.resolved, color: 'from-green-500/20 to-green-500/5',   tc: 'text-green-400'    },
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
          </button>
        ))}
      </div>

      {/* Ticket list */}
      {displayed.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center border border-white/5">
          <HeadphonesIcon size={48} className="mx-auto mb-3 text-white/20"/>
          <p className="text-white/30 font-medium">No tickets found</p>
          <p className="text-white/20 text-sm mt-1">Click "Raise Ticket" to submit a new issue</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((t, i) => {
            const sc = statusCfg[t.status] || statusCfg.open;
            const StatusIcon = sc.icon;
            const isOpen = expanded === t.id;
            return (
              <motion.div key={t.id} className="glass rounded-2xl border border-white/5 overflow-hidden"
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*.04 }}>
                {/* Ticket header — clickable to expand */}
                <button className="w-full text-left p-5 flex items-start gap-4 hover:bg-white/3 transition-colors"
                  onClick={() => setExpanded(isOpen ? null : t.id)}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${t.status==='resolved'?'bg-green-500/20':t.status==='in-progress'?'bg-blue-500/20':'bg-yellow-500/20'}`}>
                    <StatusIcon size={18} className={t.status==='resolved'?'text-green-400':t.status==='in-progress'?'text-blue-400':'text-yellow-400'}/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-semibold text-white text-sm">{t.subject}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${sc.cls}`}>{sc.label}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityCfg[t.priority]}`}>{t.priority}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/30 flex-wrap">
                      <span className="flex items-center gap-1"><Tag size={11}/>{t.category}</span>
                      <span>#{t.id}</span>
                      <span>{new Date(t.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
                      {t.resolved_at && <span className="text-green-400">Resolved {new Date(t.resolved_at).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <div className="shrink-0 text-white/30">
                    {isOpen ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                  </div>
                </button>

                {/* Expanded details */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
                      exit={{ height:0, opacity:0 }} transition={{ duration:.25 }}
                      className="overflow-hidden">
                      <div className="px-5 pb-5 space-y-4 border-t border-white/10 pt-4">
                        {/* Description */}
                        <div>
                          <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-2">Your Issue</p>
                          <p className="text-white/70 text-sm leading-relaxed bg-white/5 rounded-xl p-3 border border-white/10">{t.description}</p>
                        </div>
                        {/* Admin reply */}
                        {t.admin_reply ? (
                          <div>
                            <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <MessageSquare size={12}/> Admin Response
                            </p>
                            <div className="bg-cyan-500/10 rounded-xl p-3 border border-cyan-500/20">
                              <p className="text-white/80 text-sm leading-relaxed">{t.admin_reply}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                            <Clock size={14} className="text-white/30"/>
                            <p className="text-white/30 text-sm">Awaiting admin response...</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Raise Ticket Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title="Raise a Support Ticket" size="md">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs text-white/50 font-medium mb-1.5 block">Subject *</label>
            <input className="input-dark" placeholder="Brief description of your issue" value={form.subject} onChange={set('subject')} required/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/50 font-medium mb-1.5 block">Category *</label>
              <select className="input-dark" value={form.category} onChange={set('category')}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-white/50 font-medium mb-1.5 block">Priority *</label>
              <select className="input-dark" value={form.priority} onChange={set('priority')}>
                {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-white/50 font-medium mb-1.5 block">Detailed Description *</label>
            <textarea className="input-dark resize-none" rows={5}
              placeholder="Describe your issue in detail. Include any relevant information like transaction IDs, dates, error messages etc."
              value={form.description} onChange={set('description')} required/>
          </div>
          <div className="flex items-start gap-2 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <AlertCircle size={14} className="text-cyan-400 mt-0.5 shrink-0"/>
            <p className="text-xs text-cyan-400">Your ticket will be reviewed by the admin. You'll see their response here once they reply.</p>
          </div>
          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
            <HeadphonesIcon size={16}/> Submit Ticket
          </button>
        </form>
      </Modal>
    </DashboardLayout>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeadphonesIcon, Clock, CheckCircle, AlertCircle, MessageSquare, ChevronDown, ChevronUp, Tag, User, Send } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { getTickets, updateTicket, getStudents } from '../utils/mockData';

const statusCfg = {
  open:          { label:'Open',        bg:'rgba(212,175,55,0.12)', color:'#B8960C', border:'rgba(212,175,55,0.28)', dot:'#D4AF37' },
  'in-progress': { label:'In Progress', bg:'rgba(59,130,246,0.12)', color:'#2563EB', border:'rgba(59,130,246,0.28)', dot:'#3B82F6' },
  resolved:      { label:'Resolved',    bg:'rgba(34,197,94,0.12)',  color:'#15803D', border:'rgba(34,197,94,0.28)',  dot:'#22C55E' },
};

const priorityCfg = {
  low:    { bg:'var(--bg4)',                   color:'var(--text3)', label:'Low'    },
  medium: { bg:'rgba(212,175,55,0.12)',         color:'#B8960C',     label:'Medium' },
  high:   { bg:'rgba(239,68,68,0.12)',          color:'#DC2626',     label:'High'   },
};

const lbl = { color:'var(--text3)', fontSize:'0.72rem', fontWeight:500 };
const card = { background:'var(--bg3)', border:'1px solid var(--border2)', borderRadius:'16px', boxShadow:'var(--shadow)', overflow:'hidden' };

export default function AdminHelpdeskPage() {
  const { user } = useAuth();
  const cid = user?.college_id;
  const myStudents = getStudents(cid);

  const [tickets, setTickets]       = useState(() => getTickets().filter(t => t.college_id === cid));
  const [expanded, setExpanded]     = useState(null);
  const [replyModal, setReplyModal] = useState(null);
  const [filter, setFilter]         = useState('all');
  const [reply, setReply]           = useState('');
  const [newStatus, setNewStatus]   = useState('in-progress');

  const refresh = () => setTickets(getTickets().filter(t => t.college_id === cid));

  const submitReply = () => {
    if (!reply.trim()) return;
    updateTicket(replyModal.id, { admin_reply:reply, status:newStatus, resolved_at:newStatus==='resolved'?new Date().toISOString():null });
    refresh(); setReplyModal(null); setReply(''); setNewStatus('in-progress');
  };

  const markResolved = id => {
    updateTicket(id, { status:'resolved', resolved_at:new Date().toISOString() });
    refresh();
  };

  const displayed = filter === 'all' ? tickets : tickets.filter(t => t.status === filter);
  const stats = {
    total:    tickets.length,
    open:     tickets.filter(t => t.status==='open').length,
    progress: tickets.filter(t => t.status==='in-progress').length,
    resolved: tickets.filter(t => t.status==='resolved').length,
  };

  const statCards = [
    { label:'Total Tickets', value:stats.total,    color:'var(--text1)', bg:'var(--bg3)'              },
    { label:'Open',          value:stats.open,     color:'#B8960C',      bg:'rgba(212,175,55,0.10)'   },
    { label:'In Progress',   value:stats.progress, color:'#2563EB',      bg:'rgba(59,130,246,0.10)'   },
    { label:'Resolved',      value:stats.resolved, color:'#15803D',      bg:'rgba(34,197,94,0.10)'    },
  ];

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="flex items-center gap-2.5" style={{ color:'var(--text1)', fontWeight:900, fontSize:'1.4rem' }}>
            <HeadphonesIcon size={24} style={{ color:'var(--p)' }}/> Helpdesk
          </h1>
          <p style={{ color:'var(--text3)', fontSize:'0.8rem' }} className="mt-0.5">Manage and resolve student support tickets</p>
        </div>
        {stats.open > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{ background:'rgba(212,175,55,0.10)', border:'1px solid rgba(212,175,55,0.25)' }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background:'#D4AF37' }}/>
            <span style={{ color:'#B8960C', fontSize:'0.85rem', fontWeight:600 }}>
              {stats.open} open ticket{stats.open > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map(({ label, value, color, bg }, i) => (
          <motion.div key={i} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*.06 }}
            style={{ background:bg, border:'1px solid var(--border2)', borderRadius:'14px', padding:'1rem', boxShadow:'var(--shadow)' }}>
            <p style={{ color, fontSize:'1.5rem', fontWeight:900 }}>{value}</p>
            <p style={{ color:'var(--text3)', fontSize:'0.75rem', marginTop:'2px' }}>{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all','open','in-progress','resolved'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={filter===f ? 'btn-primary' : ''}
            style={filter!==f ? { padding:'0.4rem 1rem', borderRadius:'10px', fontSize:'0.82rem', fontWeight:500, color:'var(--text2)', border:'1px solid var(--border2)', background:'var(--bg3)', cursor:'none' } : { fontSize:'0.82rem' }}>
            {f==='all'?'All Tickets':f==='in-progress'?'In Progress':f.charAt(0).toUpperCase()+f.slice(1)}
            {f!=='all' && (
              <span className="ml-2 px-1.5 py-0.5 rounded-full text-xs"
                style={{ background:'var(--bg4)', color:'var(--text3)' }}>
                {f==='open'?stats.open:f==='in-progress'?stats.progress:stats.resolved}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Ticket list */}
      {displayed.length === 0 ? (
        <div className="rounded-2xl p-14 text-center" style={{ background:'var(--bg3)', border:'1px solid var(--border2)', boxShadow:'var(--shadow)' }}>
          <HeadphonesIcon size={40} style={{ margin:'0 auto 12px', color:'var(--text4)' }}/>
          <p style={{ color:'var(--text3)', fontWeight:500, fontSize:'0.9rem' }}>No tickets found</p>
          <p style={{ color:'var(--text4)', fontSize:'0.8rem', marginTop:'4px' }}>Student tickets will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((t, i) => {
            const sc = statusCfg[t.status] || statusCfg.open;
            const pc = priorityCfg[t.priority] || priorityCfg.medium;
            const isOpen = expanded === t.id;
            return (
              <motion.div key={t.id} style={{ ...card, borderColor: t.status==='open'?'rgba(212,175,55,0.25)':'var(--border2)' }}
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*.04 }}>
                <button className="w-full text-left p-5 flex items-start gap-4 transition-colors"
                  style={{ background:'transparent' }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(34,197,94,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}
                  onClick={() => setExpanded(isOpen ? null : t.id)}>
                  {/* Priority bar */}
                  <div className="w-1 self-stretch rounded-full shrink-0"
                    style={{ background: t.priority==='high'?'#EF4444':t.priority==='medium'?'#D4AF37':'var(--border2)' }}/>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span style={{ color:'var(--text4)', fontSize:'0.72rem', fontFamily:'monospace' }}>#{t.id}</span>
                      <p style={{ color:'var(--text1)', fontWeight:600, fontSize:'0.875rem' }}>{t.subject}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1"
                        style={{ background:sc.bg, color:sc.color, border:`1px solid ${sc.border}` }}>
                        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background:sc.dot }}/>{sc.label}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ background:pc.bg, color:pc.color }}>{pc.label}</span>
                      <span className="flex items-center gap-1" style={{ color:'var(--text4)', fontSize:'0.72rem' }}>
                        <Tag size={10}/>{t.category}
                      </span>
                      <span className="flex items-center gap-1" style={{ color:'var(--text4)', fontSize:'0.72rem' }}>
                        <User size={10}/>{t.student_name} ({t.roll_no})
                      </span>
                      <span style={{ color:'var(--text4)', fontSize:'0.72rem' }}>
                        {new Date(t.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}
                      </span>
                    </div>
                  </div>
                  <div style={{ color:'var(--text4)', flexShrink:0, marginTop:'2px' }}>
                    {isOpen ? <ChevronUp size={17}/> : <ChevronDown size={17}/>}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
                      exit={{ height:0, opacity:0 }} transition={{ duration:.22 }} className="overflow-hidden">
                      <div className="px-5 pb-5 space-y-4 pt-4" style={{ borderTop:'1px solid var(--border2)' }}>
                        <div>
                          <p style={{ color:'var(--text3)', fontSize:'0.7rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'8px' }}>Student's Issue</p>
                          <p style={{ color:'var(--text2)', fontSize:'0.875rem', lineHeight:1.6, background:'var(--bg4)', borderRadius:'10px', padding:'0.75rem', border:'1px solid var(--border2)' }}>{t.description}</p>
                        </div>
                        {t.admin_reply && (
                          <div>
                            <p className="flex items-center gap-1.5" style={{ color:'var(--p)', fontSize:'0.7rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'8px' }}>
                              <MessageSquare size={11}/> Your Response
                            </p>
                            <div style={{ background:'rgba(34,197,94,0.08)', borderRadius:'10px', padding:'0.75rem', border:'1px solid rgba(34,197,94,0.20)' }}>
                              <p style={{ color:'var(--text1)', fontSize:'0.875rem', lineHeight:1.6 }}>{t.admin_reply}</p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-3 flex-wrap pt-1">
                          {t.status !== 'resolved' && (
                            <>
                              <button onClick={() => { setReplyModal(t); setNewStatus(t.status==='open'?'in-progress':t.status); }}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                                style={{ background:'rgba(34,197,94,0.10)', color:'#15803D', border:'1px solid rgba(34,197,94,0.25)' }}
                                onMouseEnter={e => e.currentTarget.style.background='rgba(34,197,94,0.18)'}
                                onMouseLeave={e => e.currentTarget.style.background='rgba(34,197,94,0.10)'}>
                                <Send size={13}/> {t.admin_reply ? 'Update Reply' : 'Reply'}
                              </button>
                              <button onClick={() => markResolved(t.id)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                                style={{ background:'rgba(34,197,94,0.10)', color:'#15803D', border:'1px solid rgba(34,197,94,0.25)' }}
                                onMouseEnter={e => e.currentTarget.style.background='rgba(34,197,94,0.18)'}
                                onMouseLeave={e => e.currentTarget.style.background='rgba(34,197,94,0.10)'}>
                                <CheckCircle size={13}/> Mark Resolved
                              </button>
                            </>
                          )}
                          {t.status === 'resolved' && (
                            <div className="flex items-center gap-2 text-sm" style={{ color:'#15803D' }}>
                              <CheckCircle size={15}/>
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
      <Modal open={!!replyModal} onClose={() => { setReplyModal(null); setReply(''); }} title="Reply to Ticket">
        {replyModal && (
          <div className="space-y-4">
            <div className="rounded-xl p-4" style={{ background:'var(--bg4)', border:'1px solid var(--border2)' }}>
              <p style={{ color:'var(--text3)', fontSize:'0.72rem', marginBottom:'4px' }}>Ticket #{replyModal.id} — {replyModal.student_name}</p>
              <p style={{ color:'var(--text1)', fontWeight:600, fontSize:'0.875rem' }}>{replyModal.subject}</p>
              <p style={{ color:'var(--text3)', fontSize:'0.78rem', marginTop:'4px' }} className="line-clamp-2">{replyModal.description}</p>
            </div>
            <div>
              <label className="block mb-1.5" style={lbl}>Update Status</label>
              <div className="flex gap-2">
                {['in-progress','resolved'].map(s => (
                  <button key={s} onClick={() => setNewStatus(s)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all capitalize"
                    style={newStatus===s
                      ? s==='resolved'
                        ? { background:'rgba(34,197,94,0.15)', color:'#15803D', border:'1px solid rgba(34,197,94,0.30)' }
                        : { background:'rgba(59,130,246,0.15)', color:'#2563EB', border:'1px solid rgba(59,130,246,0.30)' }
                      : { background:'var(--bg4)', color:'var(--text3)', border:'1px solid var(--border2)', cursor:'none' }}>
                    {s==='in-progress'?'In Progress':'Resolved'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block mb-1.5" style={lbl}>Your Reply *</label>
              <textarea className="input-dark resize-none" rows={5}
                placeholder="Type your response to the student..."
                value={reply} onChange={e => setReply(e.target.value)}
                defaultValue={replyModal.admin_reply}/>
            </div>
            <button onClick={submitReply} disabled={!reply.trim()}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
              <Send size={15}/>
              {newStatus==='resolved' ? 'Reply & Mark Resolved' : 'Send Reply'}
            </button>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}

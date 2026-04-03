import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, HeadphonesIcon, Clock, CheckCircle, AlertCircle, MessageSquare, ChevronDown, ChevronUp, Tag, Loader2 } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const CATEGORIES = ['Academic','Fees','Technical','Library','Hostel','Placement','Other'];
const PRIORITIES  = ['low','medium','high'];

const statusCfg = {
  open:          { label:'Open',        bg:'rgba(212,175,55,0.12)', color:'#B8960C', border:'rgba(212,175,55,0.28)', Icon:Clock        },
  'in-progress': { label:'In Progress', bg:'rgba(59,130,246,0.12)', color:'#2563EB', border:'rgba(59,130,246,0.28)', Icon:AlertCircle  },
  resolved:      { label:'Resolved',    bg:'rgba(34,197,94,0.12)',  color:'#15803D', border:'rgba(34,197,94,0.28)',  Icon:CheckCircle  },
};
const priorityStyle = {
  low:    { background:'var(--bg4)', color:'var(--text3)' },
  medium: { background:'rgba(212,175,55,0.12)', color:'#B8960C' },
  high:   { background:'rgba(239,68,68,0.12)',  color:'#DC2626'  },
};
const lbl  = { color:'var(--text3)', fontSize:'0.72rem', fontWeight:500 };
const card = { background:'var(--bg3)', border:'1px solid var(--border2)', borderRadius:'16px', boxShadow:'var(--shadow)', overflow:'hidden' };

export default function HelpdeskPage() {
  const { user } = useAuth();
  const [tickets, setTickets]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter]     = useState('all');
  const [form, setForm]         = useState({ subject:'', category:'Academic', priority:'medium', description:'' });
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const load = () => {
    setLoading(true);
    api.get('/helpdesk').then(d => setTickets(Array.isArray(d) ? d : [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const submit = async e => {
    e.preventDefault();
    try { await api.post('/helpdesk', form); load(); setModal(false); setForm({ subject:'', category:'Academic', priority:'medium', description:'' }); }
    catch (err) { alert(err.message); }
  };

  const displayed = filter === 'all' ? tickets : tickets.filter(t => t.status === filter);
  const stats = { total:tickets.length, open:tickets.filter(t=>t.status==='open').length, progress:tickets.filter(t=>t.status==='in-progress').length, resolved:tickets.filter(t=>t.status==='resolved').length };
  const statCards = [
    { label:'Total',       value:stats.total,    color:'var(--text1)', bg:'var(--bg3)'              },
    { label:'Open',        value:stats.open,     color:'#B8960C',      bg:'rgba(212,175,55,0.10)'   },
    { label:'In Progress', value:stats.progress, color:'#2563EB',      bg:'rgba(59,130,246,0.10)'   },
    { label:'Resolved',    value:stats.resolved, color:'#15803D',      bg:'rgba(34,197,94,0.10)'    },
  ];

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="flex items-center gap-2.5" style={{ color:'var(--text1)', fontWeight:900, fontSize:'1.4rem' }}>
            <HeadphonesIcon size={24} style={{ color:'var(--p)' }}/> Helpdesk
          </h1>
          <p style={{ color:'var(--text3)', fontSize:'0.8rem' }} className="mt-0.5">Raise issues and track their resolution</p>
        </div>
        <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2 text-sm"><Plus size={16}/> Raise Ticket</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map(({ label, value, color, bg }, i) => (
          <motion.div key={i} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*.06 }}
            style={{ background:bg, border:'1px solid var(--border2)', borderRadius:'14px', padding:'1rem', boxShadow:'var(--shadow)' }}>
            <p style={{ color, fontSize:'1.5rem', fontWeight:900 }}>{value}</p>
            <p style={{ color:'var(--text3)', fontSize:'0.75rem', marginTop:'2px' }}>{label}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['all','open','in-progress','resolved'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={filter===f ? 'btn-primary' : ''}
            style={filter!==f ? { padding:'0.4rem 1rem', borderRadius:'10px', fontSize:'0.82rem', fontWeight:500, color:'var(--text2)', border:'1px solid var(--border2)', background:'var(--bg3)', cursor:'none' } : { fontSize:'0.82rem' }}>
            {f==='all'?'All Tickets':f==='in-progress'?'In Progress':f.charAt(0).toUpperCase()+f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 size={22} className="animate-spin" style={{ color:'var(--p)' }}/></div>
      ) : displayed.length === 0 ? (
        <div className="rounded-2xl p-14 text-center" style={{ background:'var(--bg3)', border:'1px solid var(--border2)', boxShadow:'var(--shadow)' }}>
          <HeadphonesIcon size={40} style={{ margin:'0 auto 12px', color:'var(--text4)' }}/>
          <p style={{ color:'var(--text3)', fontWeight:500, fontSize:'0.9rem' }}>No tickets found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((t, i) => {
            const sc = statusCfg[t.status] || statusCfg.open;
            const isOpen = expanded === t.id;
            return (
              <motion.div key={t.id} style={card} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*.04 }}>
                <button className="w-full text-left p-5 flex items-start gap-4 transition-colors" style={{ background:'transparent' }}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(34,197,94,0.03)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                  onClick={() => setExpanded(isOpen ? null : t.id)}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background:sc.bg }}>
                    <sc.Icon size={17} style={{ color:sc.color }}/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p style={{ color:'var(--text1)', fontWeight:600, fontSize:'0.875rem' }}>{t.subject}</p>
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background:sc.bg, color:sc.color, border:`1px solid ${sc.border}` }}>{sc.label}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={priorityStyle[t.priority]}>{t.priority}</span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap" style={{ color:'var(--text4)', fontSize:'0.72rem' }}>
                      <span className="flex items-center gap-1"><Tag size={10}/>{t.category}</span>
                      <span>#{t.id}</span>
                      <span>{new Date(t.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
                    </div>
                  </div>
                  <div style={{ color:'var(--text4)', flexShrink:0 }}>{isOpen ? <ChevronUp size={17}/> : <ChevronDown size={17}/>}</div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:.22 }} className="overflow-hidden">
                      <div className="px-5 pb-5 space-y-4 pt-4" style={{ borderTop:'1px solid var(--border2)' }}>
                        <div>
                          <p style={{ color:'var(--text3)', fontSize:'0.7rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'8px' }}>Your Issue</p>
                          <p style={{ color:'var(--text2)', fontSize:'0.875rem', lineHeight:1.6, background:'var(--bg4)', borderRadius:'10px', padding:'0.75rem', border:'1px solid var(--border2)' }}>{t.description}</p>
                        </div>
                        {t.admin_reply ? (
                          <div>
                            <p className="flex items-center gap-1.5" style={{ color:'var(--p)', fontSize:'0.7rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'8px' }}>
                              <MessageSquare size={11}/> Admin Response
                            </p>
                            <div style={{ background:'rgba(34,197,94,0.08)', borderRadius:'10px', padding:'0.75rem', border:'1px solid rgba(34,197,94,0.20)' }}>
                              <p style={{ color:'var(--text1)', fontSize:'0.875rem', lineHeight:1.6 }}>{t.admin_reply}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background:'var(--bg4)', border:'1px solid var(--border2)' }}>
                            <Clock size={13} style={{ color:'var(--text4)' }}/>
                            <p style={{ color:'var(--text3)', fontSize:'0.82rem' }}>Awaiting admin response...</p>
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

      <Modal open={modal} onClose={() => setModal(false)} title="Raise a Support Ticket">
        <form onSubmit={submit} className="space-y-4">
          <div><label className="block mb-1.5" style={lbl}>Subject *</label><input className="input-dark" placeholder="Brief description of your issue" value={form.subject} onChange={set('subject')} required/></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block mb-1.5" style={lbl}>Category *</label>
              <select className="input-dark" value={form.category} onChange={set('category')}>{CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}</select>
            </div>
            <div><label className="block mb-1.5" style={lbl}>Priority *</label>
              <select className="input-dark" value={form.priority} onChange={set('priority')}>{PRIORITIES.map(p=><option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}</select>
            </div>
          </div>
          <div><label className="block mb-1.5" style={lbl}>Detailed Description *</label><textarea className="input-dark resize-none" rows={5} placeholder="Describe your issue in detail..." value={form.description} onChange={set('description')} required/></div>
          <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.20)' }}>
            <AlertCircle size={13} style={{ color:'var(--p)', marginTop:'2px', flexShrink:0 }}/>
            <p style={{ color:'var(--pd)', fontSize:'0.78rem' }}>Your ticket will be reviewed by the admin.</p>
          </div>
          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2"><HeadphonesIcon size={15}/> Submit Ticket</button>
        </form>
      </Modal>
    </DashboardLayout>
  );
}

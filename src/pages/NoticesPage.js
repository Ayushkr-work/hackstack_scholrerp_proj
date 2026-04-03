import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Bell, Edit2, Trash2, AlertCircle } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { getNotices, saveNotices, getNextId } from '../utils/mockData';

const pCfg = {
  high:   { bg:'rgba(239,68,68,0.10)',   color:'#DC2626', border:'rgba(239,68,68,0.25)',   dot:'#EF4444' },
  medium: { bg:'rgba(212,175,55,0.10)',  color:'#B8960C', border:'rgba(212,175,55,0.25)',  dot:'#D4AF37' },
  low:    { bg:'rgba(34,197,94,0.10)',   color:'#15803D', border:'rgba(34,197,94,0.25)',   dot:'#22C55E' },
};

export default function NoticesPage() {
  const { role, user } = useAuth();
  const cid = user?.college_id;
  const [notices, setNotices] = useState(() => getNotices(cid));
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState({ title:'', description:'', priority:'medium' });
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const refresh  = () => setNotices(getNotices(cid));
  const openAdd  = () => { setEditing(null); setForm({ title:'', description:'', priority:'medium' }); setModal(true); };
  const openEdit = n  => { setEditing(n); setForm({ title:n.title, description:n.description, priority:n.priority }); setModal(true); };

  const submit = e => {
    e.preventDefault();
    const all = getNotices(cid);
    if (editing) {
      saveNotices([...getNotices(0).filter(n => n.college_id !== cid), ...all.map(n => n.id===editing.id ? {...n,...form} : n)]);
    } else {
      const allNotices = JSON.parse(localStorage.getItem('erp_notices') || '[]');
      allNotices.unshift({ id:getNextId(), ...form, college_id:cid, created_at:new Date().toISOString() });
      localStorage.setItem('erp_notices', JSON.stringify(allNotices));
    }
    refresh(); setModal(false);
  };

  const remove = id => {
    if (!window.confirm('Delete this notice?')) return;
    const allNotices = JSON.parse(localStorage.getItem('erp_notices') || '[]');
    localStorage.setItem('erp_notices', JSON.stringify(allNotices.filter(n => n.id !== id)));
    refresh();
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ color:'var(--text1)', fontWeight:900, fontSize:'1.4rem' }}>Notices</h1>
          <p style={{ color:'var(--text3)', fontSize:'0.8rem' }} className="mt-0.5">{notices.length} announcements</p>
        </div>
        {role==='admin' && <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm"><Plus size={16}/> Post Notice</button>}
      </div>

      {notices.length === 0 ? (
        <div className="rounded-2xl p-14 text-center" style={{ background:'var(--bg3)', border:'1px solid var(--border2)', boxShadow:'var(--shadow)' }}>
          <Bell size={40} style={{ margin:'0 auto 12px', color:'var(--text4)' }}/>
          <p style={{ color:'var(--text3)', fontSize:'0.85rem' }}>No notices posted yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((n, i) => {
            const p = pCfg[n.priority] || pCfg.medium;
            return (
              <motion.div key={n.id}
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*.05 }}
                className="rounded-2xl p-6"
                style={{ background:'var(--bg3)', border:'1px solid var(--border2)', boxShadow:'var(--shadow)', transition:'box-shadow .2s, border-color .2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.boxShadow='var(--shadow-h)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border2)'; e.currentTarget.style.boxShadow='var(--shadow)'; }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background:'rgba(34,197,94,0.12)' }}>
                      <AlertCircle size={18} style={{ color:'var(--p)' }}/>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 style={{ color:'var(--text1)', fontWeight:700, fontSize:'0.95rem' }}>{n.title}</h3>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1"
                          style={{ background:p.bg, color:p.color, border:`1px solid ${p.border}` }}>
                          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background:p.dot }}/>
                          {n.priority}
                        </span>
                      </div>
                      <p style={{ color:'var(--text2)', fontSize:'0.85rem', lineHeight:1.6 }}>{n.description}</p>
                      <p style={{ color:'var(--text4)', fontSize:'0.72rem', marginTop:'0.6rem' }}>
                        {new Date(n.created_at).toLocaleDateString('en-IN',{ day:'numeric', month:'long', year:'numeric' })}
                      </p>
                    </div>
                  </div>
                  {role==='admin' && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => openEdit(n)} className="p-2 rounded-lg transition-all"
                        style={{ color:'var(--text3)' }}
                        onMouseEnter={e => { e.currentTarget.style.background='rgba(34,197,94,0.10)'; e.currentTarget.style.color='var(--p)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text3)'; }}>
                        <Edit2 size={14}/>
                      </button>
                      <button onClick={() => remove(n.id)} className="p-2 rounded-lg transition-all"
                        style={{ color:'var(--text3)' }}
                        onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.10)'; e.currentTarget.style.color='#EF4444'; }}
                        onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text3)'; }}>
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Notice' : 'Post Notice'}>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block mb-1.5" style={{ color:'var(--text3)', fontSize:'0.72rem', fontWeight:500 }}>Title *</label>
            <input className="input-dark" placeholder="Notice title" value={form.title} onChange={set('title')} required/>
          </div>
          <div>
            <label className="block mb-1.5" style={{ color:'var(--text3)', fontSize:'0.72rem', fontWeight:500 }}>Description *</label>
            <textarea className="input-dark resize-none" rows={4} placeholder="Notice details..." value={form.description} onChange={set('description')} required/>
          </div>
          <div>
            <label className="block mb-1.5" style={{ color:'var(--text3)', fontSize:'0.72rem', fontWeight:500 }}>Priority</label>
            <select className="input-dark" value={form.priority} onChange={set('priority')}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <button type="submit" className="btn-primary w-full">{editing ? 'Update Notice' : 'Post Notice'}</button>
        </form>
      </Modal>
    </DashboardLayout>
  );
}

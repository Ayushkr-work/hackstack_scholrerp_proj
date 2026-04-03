import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Briefcase, Edit2, Trash2, Send, Calendar, DollarSign, Loader2 } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const empty = { company_name:'', role:'', description:'', eligibility:'', package:'', deadline:'' };
const lbl = { color:'var(--text3)', fontSize:'0.72rem', fontWeight:500 };

export default function PlacementsPage() {
  const { role } = useAuth();
  const [placements, setPlacements] = useState([]);
  const [applied, setApplied]       = useState(new Set());
  const [loading, setLoading]       = useState(true);
  const [modal, setModal]           = useState(false);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState(empty);
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const load = () => {
    setLoading(true);
    api.get('/placements').then(d => setPlacements(Array.isArray(d) ? d : [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openAdd  = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = p  => { setEditing(p); setForm({...p}); setModal(true); };

  const submit = async e => {
    e.preventDefault();
    try {
      if (editing) await api.put(`/placements/${editing.id}`, form);
      else         await api.post('/placements', form);
      load(); setModal(false);
    } catch (err) { alert(err.message); }
  };

  const remove = async id => {
    if (!window.confirm('Delete this placement?')) return;
    try { await api.delete(`/placements/${id}`); load(); } catch (err) { alert(err.message); }
  };

  const apply = async id => {
    try { await api.post(`/placements/${id}/apply`); setApplied(prev => new Set([...prev, id])); }
    catch (err) { alert(err.message); }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ color:'var(--text1)', fontWeight:900, fontSize:'1.4rem' }}>Placements</h1>
          <p style={{ color:'var(--text3)', fontSize:'0.8rem' }} className="mt-0.5">{placements.length} opportunities</p>
        </div>
        {role==='admin' && <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm"><Plus size={16}/> Add Company</button>}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3" style={{ color:'var(--text3)' }}>
          <Loader2 size={20} className="animate-spin" style={{ color:'var(--p)' }}/>
        </div>
      ) : placements.length === 0 ? (
        <div className="rounded-2xl p-14 text-center" style={{ background:'var(--bg3)', border:'1px solid var(--border2)', boxShadow:'var(--shadow)' }}>
          <Briefcase size={40} style={{ margin:'0 auto 12px', color:'var(--text4)' }}/>
          <p style={{ color:'var(--text3)', fontSize:'0.85rem' }}>No placement opportunities yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {placements.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*.06 }}
              className="flex flex-col"
              style={{ background:'var(--bg3)', border:'1px solid var(--border2)', borderRadius:'18px', padding:'1.5rem', boxShadow:'var(--shadow)', transition:'all .25s ease' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.boxShadow='var(--shadow-h)'; e.currentTarget.style.transform='translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border2)'; e.currentTarget.style.boxShadow='var(--shadow)'; e.currentTarget.style.transform='translateY(0)'; }}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background:'linear-gradient(135deg,rgba(34,197,94,0.15),rgba(212,175,55,0.15))' }}>
                  <span style={{ color:'var(--p)', fontWeight:900, fontSize:'1.1rem' }}>{p.company_name[0]}</span>
                </div>
                {role==='admin' && (
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg transition-all" style={{ color:'var(--text3)' }}
                      onMouseEnter={e => { e.currentTarget.style.background='rgba(34,197,94,0.10)'; e.currentTarget.style.color='var(--p)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text3)'; }}><Edit2 size={14}/></button>
                    <button onClick={() => remove(p.id)} className="p-1.5 rounded-lg transition-all" style={{ color:'var(--text3)' }}
                      onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.10)'; e.currentTarget.style.color='#EF4444'; }}
                      onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text3)'; }}><Trash2 size={14}/></button>
                  </div>
                )}
              </div>
              <h3 style={{ color:'var(--text1)', fontWeight:700, fontSize:'1rem', marginBottom:'0.25rem' }}>{p.company_name}</h3>
              <p style={{ color:'var(--p)', fontSize:'0.85rem', fontWeight:600, marginBottom:'0.75rem' }}>{p.role}</p>
              {p.description && <p style={{ color:'var(--text3)', fontSize:'0.82rem', lineHeight:1.5, marginBottom:'1rem', flex:1 }} className="line-clamp-2">{p.description}</p>}
              <div className="space-y-1.5 mb-4">
                {p.package    && <div className="flex items-center gap-2" style={{ color:'var(--text3)', fontSize:'0.78rem' }}><DollarSign size={12} style={{ color:'var(--p)' }}/>{p.package}</div>}
                {p.deadline   && <div className="flex items-center gap-2" style={{ color:'var(--text3)', fontSize:'0.78rem' }}><Calendar size={12} style={{ color:'var(--s)' }}/>Deadline: {new Date(p.deadline).toLocaleDateString()}</div>}
                {p.eligibility && <div className="flex items-start gap-2" style={{ color:'var(--text3)', fontSize:'0.78rem' }}><Briefcase size={12} style={{ color:'var(--text4)', marginTop:'2px', flexShrink:0 }}/><span className="line-clamp-2">{p.eligibility}</span></div>}
              </div>
              {role==='student' && (
                <button onClick={() => apply(p.id)} disabled={applied.has(p.id)}
                  className={applied.has(p.id) ? '' : 'btn-primary'}
                  style={applied.has(p.id) ? { width:'100%', padding:'0.6rem', borderRadius:'10px', fontSize:'0.85rem', fontWeight:600, background:'rgba(34,197,94,0.10)', color:'#15803D', border:'1px solid rgba(34,197,94,0.25)', cursor:'default' } : { width:'100%' }}>
                  {applied.has(p.id) ? '✓ Applied' : <span className="flex items-center justify-center gap-2"><Send size={14}/> Apply Now</span>}
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Placement' : 'Add Placement'}>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block mb-1.5" style={lbl}>Company Name *</label><input className="input-dark" placeholder="Google" value={form.company_name} onChange={set('company_name')} required/></div>
            <div><label className="block mb-1.5" style={lbl}>Role *</label><input className="input-dark" placeholder="Software Engineer" value={form.role} onChange={set('role')} required/></div>
            <div><label className="block mb-1.5" style={lbl}>Package</label><input className="input-dark" placeholder="12 LPA" value={form.package} onChange={set('package')}/></div>
            <div><label className="block mb-1.5" style={lbl}>Deadline</label><input className="input-dark" type="date" value={form.deadline} onChange={set('deadline')}/></div>
          </div>
          <div><label className="block mb-1.5" style={lbl}>Eligibility</label><input className="input-dark" placeholder="CGPA >= 7.0, CS/IT branch" value={form.eligibility} onChange={set('eligibility')}/></div>
          <div><label className="block mb-1.5" style={lbl}>Description</label><textarea className="input-dark resize-none" rows={3} placeholder="Job description..." value={form.description} onChange={set('description')}/></div>
          <button type="submit" className="btn-primary w-full">{editing ? 'Update' : 'Add Placement'}</button>
        </form>
      </Modal>
    </DashboardLayout>
  );
}

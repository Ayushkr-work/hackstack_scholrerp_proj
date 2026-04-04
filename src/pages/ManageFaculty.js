import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Loader2, GraduationCap, Pencil, Trash2 } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Modal from '../components/Modal';
import api from '../utils/api';

const lbl = { color:'var(--text3)', fontSize:'0.72rem', fontWeight:500 };
const th  = { color:'var(--text3)', fontSize:'0.7rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em' };

const empty = { name:'', email:'', password:'', department:'', phone:'' };

export default function ManageFaculty() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(empty);

  const load = () => {
    setLoading(true);
    api.get('/faculty').then(d => setFaculty(Array.isArray(d) ? d : [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = f  => { setEditing(f); setForm({ name:f.name, email:f.email, password:'', department:f.department||'', phone:f.phone||'' }); setModal(true); };

  const submit = async e => {
    e.preventDefault();
    try {
      if (editing) await api.put(`/faculty/${editing.id}`, form);
      else         await api.post('/faculty', form);
      setModal(false);
      load();
    } catch (err) { alert(err.message); }
  };

  const remove = async id => {
    if (!window.confirm('Delete this faculty member?')) return;
    try { await api.delete(`/faculty/${id}`); load(); }
    catch (err) { alert(err.message); }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ color:'var(--text1)', fontWeight:900, fontSize:'1.4rem' }}>Faculty</h1>
          <p style={{ color:'var(--text3)', fontSize:'0.8rem' }} className="mt-0.5">Manage faculty members</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16}/> Add Faculty
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden"
        style={{ background:'var(--bg3)', border:'1px solid var(--border2)', boxShadow:'var(--shadow)' }}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={22} className="animate-spin" style={{ color:'var(--p)' }}/>
          </div>
        ) : faculty.length === 0 ? (
          <div className="py-14 text-center">
            <GraduationCap size={40} style={{ margin:'0 auto 12px', color:'var(--text4)' }}/>
            <p style={{ color:'var(--text3)', fontSize:'0.85rem' }}>No faculty added yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom:'1px solid var(--border2)' }}>
                  {['Name','Email','Department','Phone','Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3" style={th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {faculty.map((f, i) => (
                  <motion.tr key={f.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.03 }}
                    style={{ borderBottom:'1px solid var(--border2)', transition:'background .15s' }}
                    onMouseEnter={e => e.currentTarget.style.background='rgba(34,197,94,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ background:'linear-gradient(135deg,#818CF8,#6366F1)' }}>
                          {f.name?.[0]?.toUpperCase()}
                        </div>
                        <span style={{ color:'var(--text1)', fontWeight:600, fontSize:'0.875rem' }}>{f.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3" style={{ color:'var(--text3)', fontSize:'0.85rem' }}>{f.email}</td>
                    <td className="px-5 py-3" style={{ color:'var(--text2)', fontSize:'0.85rem' }}>{f.department || '—'}</td>
                    <td className="px-5 py-3" style={{ color:'var(--text3)', fontSize:'0.85rem' }}>{f.phone || '—'}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(f)}
                          className="p-1.5 rounded-lg transition-all"
                          style={{ color:'var(--p)', background:'rgba(34,197,94,0.08)' }}
                          onMouseEnter={e => e.currentTarget.style.background='rgba(34,197,94,0.18)'}
                          onMouseLeave={e => e.currentTarget.style.background='rgba(34,197,94,0.08)'}>
                          <Pencil size={13}/>
                        </button>
                        <button onClick={() => remove(f.id)}
                          className="p-1.5 rounded-lg transition-all"
                          style={{ color:'#EF4444', background:'rgba(239,68,68,0.08)' }}
                          onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.18)'}
                          onMouseLeave={e => e.currentTarget.style.background='rgba(239,68,68,0.08)'}>
                          <Trash2 size={13}/>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Faculty' : 'Add Faculty'}>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1.5" style={lbl}>Name *</label>
              <input className="input-dark" placeholder="Full name" value={form.name}
                onChange={e => setForm(p => ({...p, name:e.target.value}))} required/>
            </div>
            <div>
              <label className="block mb-1.5" style={lbl}>Email *</label>
              <input className="input-dark" type="email" placeholder="faculty@college.edu" value={form.email}
                onChange={e => setForm(p => ({...p, email:e.target.value}))} required/>
            </div>
          </div>
          {!editing && (
            <div>
              <label className="block mb-1.5" style={lbl}>Password *</label>
              <input className="input-dark" type="password" placeholder="Set password" value={form.password}
                onChange={e => setForm(p => ({...p, password:e.target.value}))} required/>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1.5" style={lbl}>Department</label>
              <input className="input-dark" placeholder="e.g. CSE" value={form.department}
                onChange={e => setForm(p => ({...p, department:e.target.value}))}/>
            </div>
            <div>
              <label className="block mb-1.5" style={lbl}>Phone</label>
              <input className="input-dark" placeholder="Phone number" value={form.phone}
                onChange={e => setForm(p => ({...p, phone:e.target.value}))}/>
            </div>
          </div>
          <button type="submit" className="btn-primary w-full">
            {editing ? 'Update Faculty' : 'Add Faculty'}
          </button>
        </form>
      </Modal>
    </DashboardLayout>
  );
}

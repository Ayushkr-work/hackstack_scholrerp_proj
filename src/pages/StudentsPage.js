import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Users, Loader2 } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Modal from '../components/Modal';
import api from '../utils/api';

const empty = { name:'', email:'', password:'', roll_no:'', department:'', semester:1, phone:'', address:'' };

const T = {
  h1:   { color:'var(--text1)', fontWeight:900, fontSize:'1.4rem' },
  muted:{ color:'var(--text3)', fontSize:'0.8rem' },
  label:{ color:'var(--text3)', fontSize:'0.72rem', fontWeight:500 },
  cell: { color:'var(--text2)', fontSize:'0.85rem' },
  th:   { color:'var(--text3)', fontSize:'0.7rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em' },
  table:{ background:'var(--bg3)', border:'1px solid var(--border2)', borderRadius:'16px', overflow:'hidden', boxShadow:'var(--shadow)' },
};

export default function StudentsPage() {

  const [students, setStudents] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [search, setSearch]     = useState('');
  const [modal, setModal]       = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(empty);
  const [err, setErr]           = useState('');

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  // ── Fetch students from backend ──────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get('/students');
      setStudents(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message || 'Cannot connect to server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setEditing(null); setForm(empty); setErr(''); setModal(true); };
  const openEdit = s  => { setEditing(s); setForm({ name:s.name, email:s.email, password:'', roll_no:s.roll_no||'', department:s.department||'', semester:s.semester||1, phone:s.phone||'', address:s.address||'' }); setErr(''); setModal(true); };

  // ── Add or Edit student via API ──────────────────────────────────────────
  const submit = async e => {
    e.preventDefault(); setErr(''); setSaving(true);
    try {
      if (editing) {
        await api.put(`/students/${editing.id}`, { name:form.name, roll_no:form.roll_no, department:form.department, semester:Number(form.semester), phone:form.phone, address:form.address });
      } else {
        await api.post('/students', { ...form, semester: Number(form.semester) });
      }
      setModal(false);
      await load();
    } catch (e) {
      setErr(e.message || 'Cannot connect to server.');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete student via API ───────────────────────────────────────────────
  const remove = async id => {
    if (!window.confirm('Delete this student? This cannot be undone.')) return;
    try {
      await api.delete(`/students/${id}`);
      await load();
    } catch (e) {
      alert(e.message || 'Delete failed');
    }
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    (s.roll_no || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={T.h1}>Students</h1>
          <p style={T.muted} className="mt-0.5">{students.length} total students</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16}/> Add Student
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={15} style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'var(--text4)', pointerEvents:'none' }}/>
        <input className="input-dark input-icon-left" placeholder="Search by name, email, roll no..."
          value={search} onChange={e => setSearch(e.target.value)}/>
      </div>

      {/* Table */}
      <div style={T.table}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom:'1px solid var(--border2)' }}>
                {['Student','Roll No','Department','Semester','Phone','Actions'].map(h => (
                  <th key={h} className="text-left px-6 py-4" style={T.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-14">
                    <Loader2 size={24} className="animate-spin mx-auto" style={{ color:'var(--p)' }}/>
                    <p style={{ color:'var(--text3)', fontSize:'0.82rem', marginTop:'8px' }}>Loading students...</p>
                  </td>
                </tr>
              ) : filtered.map((s, i) => (
                <motion.tr key={s.id}
                  style={{ borderBottom:'1px solid var(--border2)', transition:'background .15s' }}
                  initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*.03 }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(34,197,94,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                        style={{ background:'linear-gradient(135deg,#22C55E,#15803D)' }}>
                        {s.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p style={{ color:'var(--text1)', fontWeight:600, fontSize:'0.85rem' }}>{s.name}</p>
                        <p style={{ color:'var(--text3)', fontSize:'0.75rem' }}>{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4" style={T.cell}>{s.roll_no || '—'}</td>
                  <td className="px-6 py-4" style={T.cell}>{s.department || '—'}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{ background:'rgba(34,197,94,0.12)', color:'var(--pd)', border:'1px solid rgba(34,197,94,0.25)' }}>
                      Sem {s.semester}
                    </span>
                  </td>
                  <td className="px-6 py-4" style={T.cell}>{s.phone || '—'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => openEdit(s)} className="p-2 rounded-lg transition-all"
                        style={{ color:'var(--text3)' }}
                        onMouseEnter={e => { e.currentTarget.style.background='rgba(34,197,94,0.10)'; e.currentTarget.style.color='var(--p)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text3)'; }}>
                        <Edit2 size={14}/>
                      </button>
                      <button onClick={() => remove(s.id)} className="p-2 rounded-lg transition-all"
                        style={{ color:'var(--text3)' }}
                        onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.10)'; e.currentTarget.style.color='#EF4444'; }}
                        onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text3)'; }}>
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {!loading && filtered.length === 0 && (
            <div className="text-center py-14" style={{ color:'var(--text3)' }}>
              <Users size={38} style={{ margin:'0 auto 10px', opacity:.3 }}/>
              <p style={{ fontSize:'0.85rem' }}>No students found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal open={modal} onClose={() => !saving && setModal(false)} title={editing ? 'Edit Student' : 'Add Student'}>
        <form onSubmit={submit} className="space-y-4">
          {err && (
            <div className="p-3 rounded-xl text-sm"
              style={{ background:'rgba(239,68,68,0.10)', border:'1px solid rgba(239,68,68,0.25)', color:'#DC2626' }}>
              ⚠ {err}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {[
              { k:'name',       label:'Full Name *',  ph:'John Doe',         type:'text'  },
              { k:'email',      label:'Email *',      ph:'john@college.edu', type:'email' },
              { k:'roll_no',    label:'Roll No',      ph:'CS2024001',        type:'text'  },
              { k:'department', label:'Department',   ph:'Computer Science', type:'text'  },
              { k:'phone',      label:'Phone',        ph:'+91 XXXXX XXXXX',  type:'text'  },
              { k:'address',    label:'Address',      ph:'City, State',      type:'text'  },
            ].map(({ k, label, ph, type }) => (
              <div key={k}>
                <label className="block mb-1.5" style={T.label}>{label}</label>
                <input className="input-dark" type={type} placeholder={ph}
                  value={form[k]} onChange={set(k)} required={label.includes('*')}/>
              </div>
            ))}

            {/* Password only for new students */}
            {!editing && (
              <div>
                <label className="block mb-1.5" style={T.label}>Password *</label>
                <input className="input-dark" type="password" placeholder="Set login password"
                  value={form.password} onChange={set('password')} required/>
              </div>
            )}

            <div>
              <label className="block mb-1.5" style={T.label}>Semester</label>
              <select className="input-dark" value={form.semester} onChange={set('semester')}>
                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
          </div>

          {/* Info box for new students */}
          {!editing && (
            <div className="p-3 rounded-xl text-xs"
              style={{ background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.20)', color:'var(--pd)' }}>
              ✓ Student will be saved to the database and can login with their email + password.
            </div>
          )}

          <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
            {saving
              ? <><Loader2 size={15} className="animate-spin"/> Saving...</>
              : editing ? 'Update Student' : 'Add Student'
            }
          </button>
        </form>
      </Modal>
    </DashboardLayout>
  );
}

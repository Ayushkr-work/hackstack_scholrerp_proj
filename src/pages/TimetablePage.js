import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Clock, BookOpen, Loader2, CalendarDays } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const th = { color:'var(--text3)', fontSize:'0.7rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em' };
const lbl = { color:'var(--text3)', fontSize:'0.72rem', fontWeight:500 };

const COLORS = ['#22C55E','#3B82F6','#F59E0B','#EC4899','#8B5CF6','#14B8A6','#F97316','#EF4444'];
const subjectColor = (subject) => COLORS[subject?.charCodeAt(0) % COLORS.length];

const fmt = t => { if (!t) return ''; const [h,m] = t.split(':'); const hr=Number(h); return `${hr%12||12}:${m} ${hr>=12?'PM':'AM'}`; };

const todayName = () => ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()];

const empty = { day:'Monday', subject:'', teacher:'', start_time:'', end_time:'', room:'' };

export default function TimetablePage() {
  const { role } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(empty);
  const [err, setErr]         = useState('');
  const [saving, setSaving]   = useState(false);
  const [activeDay, setActiveDay] = useState(todayName() === 'Sunday' ? 'Monday' : todayName());

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get('/timetable');
      setEntries(Array.isArray(data) ? data : []);
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setEditing(null); setForm({ ...empty, day: activeDay }); setErr(''); setModal(true); };
  const openEdit = e  => { setEditing(e); setForm({ day:e.day, subject:e.subject, teacher:e.teacher||'', start_time:e.start_time.slice(0,5), end_time:e.end_time.slice(0,5), room:e.room||'' }); setErr(''); setModal(true); };

  const submit = async e => {
    e.preventDefault(); setErr(''); setSaving(true);
    try {
      if (editing) await api.put(`/timetable/${editing.id}`, form);
      else         await api.post('/timetable', form);
      setModal(false); await load();
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  };

  const remove = async id => {
    if (!window.confirm('Delete this entry?')) return;
    try { await api.delete(`/timetable/${id}`); await load(); }
    catch (e) { alert(e.message); }
  };

  const today   = todayName();
  const dayEntries = entries.filter(e => e.day === activeDay);
  const todayEntries = entries.filter(e => e.day === today);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ color:'var(--text1)', fontWeight:900, fontSize:'1.4rem' }}>Timetable</h1>
          <p style={{ color:'var(--text3)', fontSize:'0.8rem' }} className="mt-0.5">
            {role === 'student' ? `Today is ${today} · ${todayEntries.length} class${todayEntries.length !== 1 ? 'es' : ''}` : 'Manage class schedule'}
          </p>
        </div>
        {role === 'admin' && (
          <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={16}/> Add Class
          </button>
        )}
      </div>

      {/* Today's highlight for students */}
      {role === 'student' && todayEntries.length > 0 && activeDay === today && (
        <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
          className="rounded-2xl p-4 mb-5 flex items-center gap-3"
          style={{ background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.20)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background:'rgba(34,197,94,0.15)' }}>
            <CalendarDays size={18} style={{ color:'var(--p)' }}/>
          </div>
          <div>
            <p style={{ color:'var(--p)', fontWeight:700, fontSize:'0.85rem' }}>Today's Schedule — {today}</p>
            <p style={{ color:'var(--text3)', fontSize:'0.75rem' }}>{todayEntries.length} class{todayEntries.length !== 1 ? 'es' : ''} scheduled</p>
          </div>
        </motion.div>
      )}

      {/* Day tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {DAYS.map(day => (
          <button key={day} onClick={() => setActiveDay(day)}
            className="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0"
            style={activeDay === day
              ? { background:'var(--p)', color:'#fff', boxShadow:'0 4px 12px rgba(34,197,94,0.30)' }
              : { background:'var(--bg3)', color:'var(--text3)', border:'1px solid var(--border2)' }}>
            {day}
            {day === today && <span className="ml-1.5 w-1.5 h-1.5 rounded-full inline-block align-middle" style={{ background: activeDay===day ? '#fff' : 'var(--p)' }}/>}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background:'var(--bg3)', border:'1px solid var(--border2)', borderRadius:'16px', overflow:'hidden', boxShadow:'var(--shadow)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom:'1px solid var(--border2)' }}>
                {['Time','Subject','Teacher','Room', ...(role==='admin'?['Actions']:[])]
                  .map(h => <th key={h} className="text-left px-6 py-4" style={th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-14">
                  <Loader2 size={22} className="animate-spin mx-auto" style={{ color:'var(--p)' }}/>
                </td></tr>
              ) : dayEntries.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-14" style={{ color:'var(--text3)' }}>
                  <BookOpen size={36} style={{ margin:'0 auto 10px', opacity:.3 }}/>
                  <p style={{ fontSize:'0.85rem' }}>No classes on {activeDay}</p>
                </td></tr>
              ) : dayEntries.map((e, i) => (
                <motion.tr key={e.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*.04 }}
                  style={{ borderBottom:'1px solid var(--border2)', transition:'background .15s' }}
                  onMouseEnter={ev => ev.currentTarget.style.background='rgba(34,197,94,0.04)'}
                  onMouseLeave={ev => ev.currentTarget.style.background='transparent'}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Clock size={13} style={{ color:'var(--text4)' }}/>
                      <span style={{ color:'var(--text2)', fontSize:'0.85rem', fontWeight:600 }}>
                        {fmt(e.start_time)} – {fmt(e.end_time)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: subjectColor(e.subject) }}/>
                      <span style={{ color:'var(--text1)', fontWeight:700, fontSize:'0.85rem' }}>{e.subject}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4" style={{ color:'var(--text2)', fontSize:'0.85rem' }}>{e.teacher || '—'}</td>
                  <td className="px-6 py-4">
                    {e.room
                      ? <span className="px-2.5 py-1 rounded-lg text-xs font-semibold" style={{ background:'var(--bg4)', color:'var(--text2)', border:'1px solid var(--border2)' }}>{e.room}</span>
                      : <span style={{ color:'var(--text4)' }}>—</span>}
                  </td>
                  {role === 'admin' && (
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => openEdit(e)} className="p-2 rounded-lg transition-all" style={{ color:'var(--text3)' }}
                          onMouseEnter={ev => { ev.currentTarget.style.background='rgba(34,197,94,0.10)'; ev.currentTarget.style.color='var(--p)'; }}
                          onMouseLeave={ev => { ev.currentTarget.style.background='transparent'; ev.currentTarget.style.color='var(--text3)'; }}>
                          <Edit2 size={14}/>
                        </button>
                        <button onClick={() => remove(e.id)} className="p-2 rounded-lg transition-all" style={{ color:'var(--text3)' }}
                          onMouseEnter={ev => { ev.currentTarget.style.background='rgba(239,68,68,0.10)'; ev.currentTarget.style.color='#EF4444'; }}
                          onMouseLeave={ev => { ev.currentTarget.style.background='transparent'; ev.currentTarget.style.color='var(--text3)'; }}>
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin modal */}
      {role === 'admin' && (
        <Modal open={modal} onClose={() => !saving && setModal(false)} title={editing ? 'Edit Class' : 'Add Class'}>
          <form onSubmit={submit} className="space-y-4">
            {err && <div className="p-3 rounded-xl text-sm" style={{ background:'rgba(239,68,68,0.10)', border:'1px solid rgba(239,68,68,0.25)', color:'#DC2626' }}>⚠ {err}</div>}
            <div>
              <label className="block mb-1.5" style={lbl}>Day *</label>
              <select className="input-dark" value={form.day} onChange={set('day')} required>
                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1.5" style={lbl}>Start Time *</label>
                <input className="input-dark" type="time" value={form.start_time} onChange={set('start_time')} required/>
              </div>
              <div>
                <label className="block mb-1.5" style={lbl}>End Time *</label>
                <input className="input-dark" type="time" value={form.end_time} onChange={set('end_time')} required/>
              </div>
            </div>
            <div>
              <label className="block mb-1.5" style={lbl}>Subject *</label>
              <input className="input-dark" placeholder="e.g. Mathematics" value={form.subject} onChange={set('subject')} required/>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1.5" style={lbl}>Teacher</label>
                <input className="input-dark" placeholder="e.g. Dr. Sharma" value={form.teacher} onChange={set('teacher')}/>
              </div>
              <div>
                <label className="block mb-1.5" style={lbl}>Room</label>
                <input className="input-dark" placeholder="e.g. A-101" value={form.room} onChange={set('room')}/>
              </div>
            </div>
            <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
              {saving ? <><Loader2 size={15} className="animate-spin"/> Saving...</> : editing ? 'Update Class' : 'Add Class'}
            </button>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  );
}

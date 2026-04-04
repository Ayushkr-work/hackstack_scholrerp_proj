import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Plus, FileText, Loader2, GraduationCap, Clock, BookOpen, ClipboardList, Trash2 } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Modal from '../components/Modal';
import Chatbot from '../components/Chatbot';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const lbl = { color:'var(--text3)', fontSize:'0.72rem', fontWeight:500 };

export default function FacultyDashboard() {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState([]);
  const [students,  setStudents]  = useState([]);
  const [notes,     setNotes]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [modal,     setModal]     = useState(false);
  const [noteModal, setNoteModal] = useState(false);
  const [form,      setForm]      = useState({ student_id:'', semester:1, results:[{ subject:'', marks:'', max_marks:100, grade:'' }] });
  const [noteForm,  setNoteForm]  = useState({ title:'', content:'', subject:'', semester:'', type:'note', deadline:'' });
  const [activeDay, setActiveDay] = useState(DAYS[new Date().getDay() - 1] || 'Monday');

  const loadNotes = () => api.get('/faculty/notes').then(d => setNotes(Array.isArray(d) ? d : [])).catch(() => {});

  useEffect(() => {
    Promise.all([
      api.get('/faculty/my/timetable'),
      api.get('/faculty/my/students'),
      api.get('/faculty/notes'),
    ]).then(([tt, stu, nt]) => {
      setTimetable(Array.isArray(tt) ? tt : []);
      setStudents(Array.isArray(stu) ? stu : []);
      setNotes(Array.isArray(nt) ? nt : []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const addRow = () => setForm(p => ({ ...p, results:[...p.results, { subject:'', marks:'', max_marks:100, grade:'' }] }));
  const updRow = (i, k, v) => setForm(p => { const r=[...p.results]; r[i]={...r[i],[k]:v}; return {...p,results:r}; });
  const removeRow = i => setForm(p => ({ ...p, results: p.results.filter((_,idx)=>idx!==i) }));

  const submit = async e => {
    e.preventDefault();
    try {
      await api.post('/faculty/my/marks', form);
      setModal(false);
      setForm({ student_id:'', semester:1, results:[{ subject:'', marks:'', max_marks:100, grade:'' }] });
    } catch (err) { alert(err.message); }
  };

  const submitNote = async e => {
    e.preventDefault();
    try {
      await api.post('/faculty/notes', noteForm);
      setNoteModal(false);
      setNoteForm({ title:'', content:'', subject:'', semester:'', type:'note', deadline:'' });
      loadNotes();
    } catch (err) { alert(err.message); }
  };

  const deleteNote = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    try { await api.delete(`/faculty/notes/${id}`); loadNotes(); } catch (err) { alert(err.message); }
  };

  const daySlots = timetable.filter(t => t.day === activeDay);
  const totalClasses = timetable.length;
  const uniqueSubjects = [...new Set(timetable.map(t => t.subject))].length;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ color:'var(--text1)', fontWeight:900, fontSize:'1.4rem' }}>
            Welcome, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ color:'var(--text3)', fontSize:'0.8rem' }} className="mt-0.5">
            {user?.department || 'Faculty'} · {user?.email}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setNoteModal(true)} className="btn-secondary flex items-center gap-2 text-sm"
            style={{ background:'rgba(129,140,248,0.12)', color:'#818CF8', border:'1px solid rgba(129,140,248,0.25)' }}>
            <BookOpen size={16}/> Post Note
          </button>
          <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={16}/> Add Marks
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {[
          { label:'Total Classes', value: totalClasses, icon: CalendarDays, color:'#818CF8' },
          { label:'Subjects',      value: uniqueSubjects, icon: BookOpen,    color:'#22C55E' },
          { label:'Students',      value: students.length, icon: GraduationCap, color:'#D4AF37' },
        ].map(({ label, value, icon:Icon, color }) => (
          <motion.div key={label} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            className="rounded-2xl p-5"
            style={{ background:'var(--bg3)', border:'1px solid var(--border2)', boxShadow:'var(--shadow)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background:`${color}18` }}>
                <Icon size={18} style={{ color }}/>
              </div>
              <div>
                <p style={{ color:'var(--text3)', fontSize:'0.72rem', fontWeight:500 }}>{label}</p>
                <p style={{ color:'var(--text1)', fontWeight:800, fontSize:'1.4rem', lineHeight:1 }}>{value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Timetable */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background:'var(--bg3)', border:'1px solid var(--border2)', boxShadow:'var(--shadow)' }}>
        <div className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom:'1px solid var(--border2)', background:'var(--bg4)' }}>
          <div className="flex items-center gap-2">
            <CalendarDays size={16} style={{ color:'#818CF8' }}/>
            <h2 style={{ color:'var(--text1)', fontWeight:700 }}>My Timetable</h2>
          </div>
        </div>

        {/* Day tabs */}
        <div className="flex gap-1 p-3 overflow-x-auto" style={{ borderBottom:'1px solid var(--border2)' }}>
          {DAYS.map(day => (
            <button key={day} onClick={() => setActiveDay(day)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all"
              style={{
                background: activeDay === day ? '#818CF8' : 'transparent',
                color: activeDay === day ? '#fff' : 'var(--text3)',
                border: `1px solid ${activeDay === day ? '#818CF8' : 'var(--border2)'}`,
              }}>
              {day.slice(0,3)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={22} className="animate-spin" style={{ color:'#818CF8' }}/>
          </div>
        ) : daySlots.length === 0 ? (
          <div className="py-14 text-center">
            <CalendarDays size={36} style={{ margin:'0 auto 10px', color:'var(--text4)' }}/>
            <p style={{ color:'var(--text3)', fontSize:'0.85rem' }}>No classes on {activeDay}</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {daySlots.map((slot, i) => (
              <motion.div key={slot.id} initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-xl"
                style={{ background:'var(--bg4)', border:'1px solid var(--border2)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background:'rgba(129,140,248,0.12)' }}>
                  <Clock size={16} style={{ color:'#818CF8' }}/>
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ color:'var(--text1)', fontWeight:700, fontSize:'0.9rem' }}>{slot.subject}</p>
                  <p style={{ color:'var(--text3)', fontSize:'0.78rem' }}>Room {slot.room || 'TBA'}</p>
                </div>
                <div className="text-right shrink-0">
                  <p style={{ color:'var(--text2)', fontWeight:600, fontSize:'0.85rem' }}>
                    {slot.start_time?.slice(0,5)} – {slot.end_time?.slice(0,5)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Notes Section */}
      <div className="mt-6 rounded-2xl overflow-hidden"
        style={{ background:'var(--bg3)', border:'1px solid var(--border2)', boxShadow:'var(--shadow)' }}>
        <div className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom:'1px solid var(--border2)', background:'var(--bg4)' }}>
          <div className="flex items-center gap-2">
            <BookOpen size={16} style={{ color:'#818CF8' }}/>
            <h2 style={{ color:'var(--text1)', fontWeight:700 }}>My Notes & Assignments</h2>
          </div>
          <span style={{ color:'var(--text3)', fontSize:'0.78rem' }}>{notes.length} posted</span>
        </div>
        {notes.length === 0 ? (
          <div className="py-12 text-center">
            <BookOpen size={32} style={{ margin:'0 auto 10px', color:'var(--text4)' }}/>
            <p style={{ color:'var(--text3)', fontSize:'0.85rem' }}>No notes posted yet</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {notes.map((n, i) => {
              const isAssignment = n.type === 'assignment';
              const isProject    = n.type === 'project';
              const accent = isProject ? '#22C55E' : isAssignment ? '#F59E0B' : '#818CF8';
              const AccIcon = isProject ? ClipboardList : isAssignment ? ClipboardList : BookOpen;
              return (
                <motion.div key={n.id} initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-start gap-4 p-4 rounded-xl"
                  style={{ background:'var(--bg4)', border:'1px solid var(--border2)' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background:`${accent}18` }}>
                    {isAssignment || isProject ? <ClipboardList size={15} style={{ color:accent }}/> : <BookOpen size={15} style={{ color:accent }}/>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p style={{ color:'var(--text1)', fontWeight:700, fontSize:'0.88rem' }}>{n.title}</p>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize"
                        style={{ background:`${accent}18`, color:accent }}>{n.type}</span>
                    </div>
                    {n.content && <p className="text-xs mt-1 line-clamp-2" style={{ color:'var(--text3)' }}>{n.content}</p>}
                    <div className="flex flex-wrap gap-3 mt-1.5" style={{ fontSize:'0.72rem', color:'var(--text4)' }}>
                      {n.subject   && <span>{n.subject}</span>}
                      {n.semester  && <span>Sem {n.semester}</span>}
                      {n.deadline  && <span style={{ color: new Date(n.deadline)<new Date() ? '#EF4444':'#F59E0B' }}>
                        Due: {new Date(n.deadline).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <button onClick={() => deleteNote(n.id)}
                    className="p-1.5 rounded-lg transition-colors shrink-0"
                    style={{ color:'var(--text4)' }}
                    onMouseEnter={e=>e.currentTarget.style.color='#EF4444'}
                    onMouseLeave={e=>e.currentTarget.style.color='var(--text4)'}>
                    <Trash2 size={14}/>
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Post Note Modal */}
      <Modal open={noteModal} onClose={() => setNoteModal(false)} title="Post Note / Assignment">
        <form onSubmit={submitNote} className="space-y-4">
          {/* Department info banner */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium"
            style={{ background:'rgba(129,140,248,0.10)', border:'1px solid rgba(129,140,248,0.20)', color:'#818CF8' }}>
            <BookOpen size={13}/>
            This will be visible to <strong>{user?.department || 'your'}</strong> department students only
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1.5" style={lbl}>Type *</label>
              <select className="input-dark" value={noteForm.type}
                onChange={e => setNoteForm(p => ({...p, type:e.target.value}))}>
                <option value="note">Note</option>
                <option value="assignment">Assignment</option>
                <option value="project">Project</option>
              </select>
            </div>
            <div>
              <label className="block mb-1.5" style={lbl}>Subject</label>
              <input className="input-dark" placeholder="e.g. Data Structures" value={noteForm.subject}
                onChange={e => setNoteForm(p => ({...p, subject:e.target.value}))}/>
            </div>
          </div>
          <div>
            <label className="block mb-1.5" style={lbl}>Title *</label>
            <input className="input-dark" placeholder="Note title" value={noteForm.title}
              onChange={e => setNoteForm(p => ({...p, title:e.target.value}))} required/>
          </div>
          <div>
            <label className="block mb-1.5" style={lbl}>Content / Description</label>
            <textarea className="input-dark" rows={4} placeholder="Write note content or assignment instructions..."
              value={noteForm.content} onChange={e => setNoteForm(p => ({...p, content:e.target.value}))}/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1.5" style={lbl}>Semester</label>
              <select className="input-dark" value={noteForm.semester}
                onChange={e => setNoteForm(p => ({...p, semester:e.target.value}))}>
                <option value="">All semesters</option>
                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1.5" style={lbl}>
                {noteForm.type === 'assignment' ? 'Deadline *' : 'Deadline (optional)'}
              </label>
              <input className="input-dark" type="date" value={noteForm.deadline}
                onChange={e => setNoteForm(p => ({...p, deadline:e.target.value}))}
                required={noteForm.type === 'assignment' || noteForm.type === 'project'}/>
            </div>
          </div>
          <button type="submit" className="btn-primary w-full">
            <BookOpen size={15} className="inline mr-2"/>
            Post {noteForm.type === 'assignment' ? 'Assignment' : noteForm.type === 'project' ? 'Project' : 'Note'}
          </button>
        </form>
      </Modal>

      {/* Add Marks Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title="Upload Student Marks" size="lg">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1.5" style={lbl}>Student *</label>
              <select className="input-dark" value={form.student_id}
                onChange={e => setForm(p => ({...p, student_id:e.target.value}))} required>
                <option value="">Select student</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.roll_no})</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1.5" style={lbl}>Semester *</label>
              <select className="input-dark" value={form.semester}
                onChange={e => setForm(p => ({...p, semester:e.target.value}))}>
                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-2 px-1" style={{ color:'var(--text3)', fontSize:'0.72rem', fontWeight:500 }}>
              <span>Subject</span><span>Marks</span><span>Max</span><span>Grade</span>
            </div>
            {form.results.map((r, i) => (
              <div key={i} className="grid grid-cols-4 gap-2 items-center">
                <input className="input-dark text-sm py-2" placeholder="Subject" value={r.subject}
                  onChange={e => updRow(i,'subject',e.target.value)}/>
                <input className="input-dark text-sm py-2" type="number" placeholder="Marks" value={r.marks}
                  onChange={e => updRow(i,'marks',e.target.value)}/>
                <input className="input-dark text-sm py-2" type="number" placeholder="100" value={r.max_marks}
                  onChange={e => updRow(i,'max_marks',e.target.value)}/>
                <div className="flex gap-1">
                  <input className="input-dark text-sm py-2 flex-1" placeholder="A+" value={r.grade}
                    onChange={e => updRow(i,'grade',e.target.value)}/>
                  {form.results.length > 1 && (
                    <button type="button" onClick={() => removeRow(i)}
                      className="px-2 rounded-lg text-xs"
                      style={{ color:'#EF4444', background:'rgba(239,68,68,0.08)' }}>✕</button>
                  )}
                </div>
              </div>
            ))}
            <button type="button" onClick={addRow} style={{ color:'var(--p)', fontSize:'0.85rem' }}
              className="hover:underline">+ Add Subject</button>
          </div>

          <button type="submit" className="btn-primary w-full">
            <FileText size={15} className="inline mr-2"/>Upload Marks
          </button>
        </form>
      </Modal>
      <Chatbot/>
    </DashboardLayout>
  );
}
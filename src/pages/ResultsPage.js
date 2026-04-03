import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, FileText } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { getStudents, getResults, uploadResults } from '../utils/mockData';

const gradeColor = g => {
  if (!g) return 'text-white/40';
  if (['O','A+','A'].includes(g)) return 'text-green-400';
  if (['B+','B'].includes(g)) return 'text-cyan-400';
  if (['C+','C'].includes(g)) return 'text-yellow-400';
  return 'text-red-400';
};

export default function ResultsPage() {
  const { role, user } = useAuth();
  const cid = user?.college_id;
  const students = role === 'admin' ? getStudents(cid) : [];
  const [selStudent, setSelStudent] = useState(role === 'student' ? String(user?.id) : '');
  const [results, setResults]       = useState(() => role === 'student' ? getResults(user?.id) : []);
  const [modal, setModal]           = useState(false);
  const [form, setForm]             = useState({ student_id:'', semester:1, rows:[{ subject:'', marks:'', max_marks:100, grade:'' }] });

  const loadResults = (sid) => { setSelStudent(sid); setResults(getResults(sid)); };
  const addRow = () => setForm(p => ({ ...p, rows:[...p.rows, { subject:'', marks:'', max_marks:100, grade:'' }] }));
  const updRow = (i, k, v) => setForm(p => { const r=[...p.rows]; r[i]={...r[i],[k]:v}; return {...p,rows:r}; });

  const submit = e => {
    e.preventDefault();
    uploadResults(form.student_id, form.semester, form.rows);
    if (selStudent === String(form.student_id)) setResults(getResults(form.student_id));
    setModal(false);
    setForm({ student_id:'', semester:1, rows:[{ subject:'', marks:'', max_marks:100, grade:'' }] });
  };

  const bySem = results.reduce((acc, r) => { (acc[r.semester] || (acc[r.semester]=[])).push(r); return acc; }, {});

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-black text-white">Results</h1><p className="text-white/40 text-sm">Semester-wise academic results</p></div>
        {role === 'admin' && <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2 text-sm"><Plus size={16}/> Upload Results</button>}
      </div>

      {role === 'admin' && (
        <div className="mb-6">
          <select className="input-dark max-w-xs" value={selStudent} onChange={e => loadResults(e.target.value)}>
            <option value="">Select a student...</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.roll_no})</option>)}
          </select>
        </div>
      )}

      {Object.keys(bySem).length === 0
        ? <div className="glass rounded-2xl p-12 text-center border border-white/5"><FileText size={48} className="mx-auto mb-3 text-white/20"/><p className="text-white/30">{role==='admin'?'Select a student to view results':'No results available yet'}</p></div>
        : <div className="space-y-6">
            {Object.entries(bySem).map(([sem, rows]) => {
              const avg = Math.round(rows.reduce((a,r) => a+(r.marks/r.max_marks)*100, 0)/rows.length);
              return (
                <motion.div key={sem} className="glass rounded-2xl border border-white/5 overflow-hidden" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
                  <div className="flex items-center justify-between px-6 py-4 border-b border-white/10" style={{background:'linear-gradient(135deg,rgba(0,240,255,.05),rgba(168,85,247,.05))'}}>
                    <h2 className="font-bold text-white">Semester {sem}</h2>
                    <span className="text-sm text-white/40">Avg: <span className={`font-bold ${avg>=75?'text-green-400':avg>=50?'text-yellow-400':'text-red-400'}`}>{avg}%</span></span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead><tr className="border-b border-white/5">{['Subject','Marks','Max','Percentage','Grade'].map(h=><th key={h} className="text-left px-6 py-3 text-xs text-white/40 uppercase tracking-wider">{h}</th>)}</tr></thead>
                      <tbody>
                        {rows.map((r,i) => (
                          <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                            <td className="px-6 py-3 text-white text-sm font-medium">{r.subject}</td>
                            <td className="px-6 py-3 text-white/80 text-sm">{r.marks}</td>
                            <td className="px-6 py-3 text-white/40 text-sm">{r.max_marks}</td>
                            <td className="px-6 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-20 h-1.5 bg-white/10 rounded-full"><div className="h-full rounded-full" style={{width:`${(r.marks/r.max_marks)*100}%`,background:'linear-gradient(90deg,#00f0ff,#a855f7)'}}/></div>
                                <span className="text-sm text-white/60">{Math.round((r.marks/r.max_marks)*100)}%</span>
                              </div>
                            </td>
                            <td className={`px-6 py-3 text-sm font-bold ${gradeColor(r.grade)}`}>{r.grade||'—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              );
            })}
          </div>
      }

      <Modal open={modal} onClose={() => setModal(false)} title="Upload Results" size="lg">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Student *</label>
              <select className="input-dark" value={form.student_id} onChange={e=>setForm(p=>({...p,student_id:e.target.value}))} required>
                <option value="">Select student</option>
                {students.map(s=><option key={s.id} value={s.id}>{s.name} ({s.roll_no})</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Semester *</label>
              <select className="input-dark" value={form.semester} onChange={e=>setForm(p=>({...p,semester:e.target.value}))}>
                {[1,2,3,4,5,6,7,8].map(s=><option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-2 text-xs text-white/40 px-1"><span>Subject</span><span>Marks</span><span>Max</span><span>Grade</span></div>
            {form.rows.map((r,i) => (
              <div key={i} className="grid grid-cols-4 gap-2">
                <input className="input-dark text-sm py-2" placeholder="Subject" value={r.subject} onChange={e=>updRow(i,'subject',e.target.value)}/>
                <input className="input-dark text-sm py-2" type="number" placeholder="Marks" value={r.marks} onChange={e=>updRow(i,'marks',e.target.value)}/>
                <input className="input-dark text-sm py-2" type="number" placeholder="100" value={r.max_marks} onChange={e=>updRow(i,'max_marks',e.target.value)}/>
                <input className="input-dark text-sm py-2" placeholder="A+" value={r.grade} onChange={e=>updRow(i,'grade',e.target.value)}/>
              </div>
            ))}
            <button type="button" onClick={addRow} className="text-cyan-400 text-sm hover:underline">+ Add Subject</button>
          </div>
          <button type="submit" className="btn-primary w-full">Upload Results</button>
        </form>
      </Modal>
    </DashboardLayout>
  );
}

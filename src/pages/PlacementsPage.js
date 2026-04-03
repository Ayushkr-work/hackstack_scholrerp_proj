import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Briefcase, Edit2, Trash2, Send, Calendar, DollarSign } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { getPlacements, savePlacements, getNextId } from '../utils/mockData';

const empty = { company_name:'', role:'', description:'', eligibility:'', package:'', deadline:'' };

export default function PlacementsPage() {
  const { role, user } = useAuth();
  const cid = user?.college_id;
  const [placements, setPlacements] = useState(() => getPlacements(cid));
  const [applied, setApplied]       = useState(new Set());
  const [modal, setModal]           = useState(false);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState(empty);
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const refresh = () => setPlacements(getPlacements(cid));

  const openAdd  = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = p  => { setEditing(p); setForm({...p}); setModal(true); };

  const submit = e => {
    e.preventDefault();
    const all = JSON.parse(localStorage.getItem('erp_placements') || '[]');
    if (editing) {
      savePlacements(all.map(x => x.id===editing.id ? {...x,...form} : x));
    } else {
      savePlacements([{ id:getNextId(), ...form, college_id:cid, created_at:new Date().toISOString() }, ...all]);
    }
    refresh(); setModal(false);
  };

  const remove = id => {
    if (!window.confirm('Delete this placement?')) return;
    const all = JSON.parse(localStorage.getItem('erp_placements') || '[]');
    savePlacements(all.filter(x => x.id !== id));
    refresh();
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-black text-white">Placements</h1><p className="text-white/40 text-sm">{placements.length} opportunities</p></div>
        {role==='admin' && <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm"><Plus size={16}/> Add Company</button>}
      </div>

      {placements.length === 0
        ? <div className="glass rounded-2xl p-12 text-center border border-white/5"><Briefcase size={48} className="mx-auto mb-3 text-white/20"/><p className="text-white/30">No placement opportunities yet</p></div>
        : <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {placements.map((p,i) => (
              <motion.div key={p.id} className="glass rounded-2xl p-6 border border-white/5 card-hover flex flex-col"
                initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*.06}}
                whileHover={{borderColor:'rgba(0,240,255,.2)'}}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                    <span className="text-cyan-400 font-black text-lg">{p.company_name[0]}</span>
                  </div>
                  {role==='admin' && (
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-cyan-500/10 text-white/30 hover:text-cyan-400 transition-colors"><Edit2 size={14}/></button>
                      <button onClick={() => remove(p.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors"><Trash2 size={14}/></button>
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-white text-lg mb-1">{p.company_name}</h3>
                <p className="text-cyan-400 text-sm font-medium mb-3">{p.role}</p>
                {p.description && <p className="text-white/40 text-sm mb-4 line-clamp-2 flex-1">{p.description}</p>}
                <div className="space-y-2 mb-4">
                  {p.package    && <div className="flex items-center gap-2 text-xs text-white/50"><DollarSign size={13} className="text-green-400"/><span>{p.package}</span></div>}
                  {p.deadline   && <div className="flex items-center gap-2 text-xs text-white/50"><Calendar size={13} className="text-yellow-400"/><span>Deadline: {new Date(p.deadline).toLocaleDateString()}</span></div>}
                  {p.eligibility && <div className="flex items-start gap-2 text-xs text-white/50"><Briefcase size={13} className="text-purple-400 mt-0.5 shrink-0"/><span className="line-clamp-2">{p.eligibility}</span></div>}
                </div>
                {role==='student' && (
                  <button onClick={() => setApplied(prev => new Set([...prev, p.id]))} disabled={applied.has(p.id)}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${applied.has(p.id)?'bg-green-500/10 text-green-400 border border-green-500/20 cursor-default':'btn-primary'}`}>
                    {applied.has(p.id) ? '✓ Applied' : <><Send size={14}/> Apply Now</>}
                  </button>
                )}
              </motion.div>
            ))}
          </div>
      }

      <Modal open={modal} onClose={() => setModal(false)} title={editing?'Edit Placement':'Add Placement'}>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-white/50 mb-1.5 block">Company Name *</label><input className="input-dark" placeholder="Google" value={form.company_name} onChange={set('company_name')} required/></div>
            <div><label className="text-xs text-white/50 mb-1.5 block">Role *</label><input className="input-dark" placeholder="Software Engineer" value={form.role} onChange={set('role')} required/></div>
            <div><label className="text-xs text-white/50 mb-1.5 block">Package</label><input className="input-dark" placeholder="12 LPA" value={form.package} onChange={set('package')}/></div>
            <div><label className="text-xs text-white/50 mb-1.5 block">Deadline</label><input className="input-dark" type="date" value={form.deadline} onChange={set('deadline')}/></div>
          </div>
          <div><label className="text-xs text-white/50 mb-1.5 block">Eligibility</label><input className="input-dark" placeholder="CGPA >= 7.0, CS/IT branch" value={form.eligibility} onChange={set('eligibility')}/></div>
          <div><label className="text-xs text-white/50 mb-1.5 block">Description</label><textarea className="input-dark resize-none" rows={3} placeholder="Job description..." value={form.description} onChange={set('description')}/></div>
          <button type="submit" className="btn-primary w-full">{editing?'Update':'Add Placement'}</button>
        </form>
      </Modal>
    </DashboardLayout>
  );
}

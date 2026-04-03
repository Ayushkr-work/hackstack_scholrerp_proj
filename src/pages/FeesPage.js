import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, CreditCard, CheckCircle, Clock } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { getFees, saveFees, getStudents, getNextId } from '../utils/mockData';

const T = {
  th:   { color:'var(--text3)', fontSize:'0.7rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em' },
  cell: { color:'var(--text2)', fontSize:'0.85rem' },
  lbl:  { color:'var(--text3)', fontSize:'0.72rem', fontWeight:500 },
};

export default function FeesPage() {
  const { role, user } = useAuth();
  const cid = user?.college_id;
  const myStudents = getStudents(cid);

  const [fees, setFees]         = useState(() => getFees());
  const [modal, setModal]       = useState(false);
  const [payModal, setPayModal] = useState(null);
  const [form, setForm]         = useState({ student_id:'', amount:'', description:'', due_date:'' });
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const refresh = () => setFees(getFees());

  const displayed = role === 'admin'
    ? fees.filter(f => myStudents.find(s => s.id === f.student_id))
    : fees.filter(f => f.student_id === user?.id);

  const totalPaid    = displayed.filter(f => f.status==='paid').reduce((a,f) => a+Number(f.amount), 0);
  const totalPending = displayed.filter(f => f.status==='pending').reduce((a,f) => a+Number(f.amount), 0);

  const createFee = e => {
    e.preventDefault();
    const student = myStudents.find(s => s.id === Number(form.student_id));
    const all = getFees();
    saveFees([...all, { id:getNextId(), student_id:Number(form.student_id), student_name:student?.name, roll_no:student?.roll_no, amount:Number(form.amount), description:form.description, status:'pending', due_date:form.due_date, paid_at:null, created_at:new Date().toISOString() }]);
    refresh(); setModal(false); setForm({ student_id:'', amount:'', description:'', due_date:'' });
  };

  const simulatePay = id => {
    const all = getFees();
    saveFees(all.map(f => f.id===id ? {...f, status:'paid', paid_at:new Date().toISOString()} : f));
    refresh(); setPayModal(null);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ color:'var(--text1)', fontWeight:900, fontSize:'1.4rem' }}>Fee Management</h1>
          <p style={{ color:'var(--text3)', fontSize:'0.8rem' }} className="mt-0.5">Track and manage fee payments</p>
        </div>
        {role==='admin' && (
          <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={16}/> Add Fee
          </button>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-2xl p-5" style={{ background:'var(--bg3)', border:'1px solid rgba(34,197,94,0.20)', boxShadow:'var(--shadow)' }}>
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle size={18} style={{ color:'var(--p)' }}/>
            <span style={{ color:'var(--text2)', fontSize:'0.85rem' }}>Total Paid</span>
          </div>
          <p style={{ color:'var(--p)', fontSize:'1.5rem', fontWeight:900 }}>₹{totalPaid.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl p-5" style={{ background:'var(--bg3)', border:'1px solid rgba(212,175,55,0.20)', boxShadow:'var(--shadow)' }}>
          <div className="flex items-center gap-3 mb-2">
            <Clock size={18} style={{ color:'var(--s)' }}/>
            <span style={{ color:'var(--text2)', fontSize:'0.85rem' }}>Pending</span>
          </div>
          <p style={{ color:'var(--s)', fontSize:'1.5rem', fontWeight:900 }}>₹{totalPending.toLocaleString()}</p>
        </div>
      </div>

      {/* Table */}
      <div style={{ background:'var(--bg3)', border:'1px solid var(--border2)', borderRadius:'16px', overflow:'hidden', boxShadow:'var(--shadow)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom:'1px solid var(--border2)' }}>
                {[role==='admin'?'Student':null,'Description','Amount','Due Date','Status','Action']
                  .filter(Boolean).map(h => (
                  <th key={h} className="text-left px-6 py-4" style={T.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-14" style={{ color:'var(--text3)' }}>
                    <CreditCard size={38} style={{ margin:'0 auto 10px', opacity:.3 }}/>
                    <p style={{ fontSize:'0.85rem' }}>No fee records found</p>
                  </td>
                </tr>
              ) : displayed.map((f, i) => (
                <motion.tr key={f.id}
                  style={{ borderBottom:'1px solid var(--border2)', transition:'background .15s' }}
                  initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*.03 }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(34,197,94,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  {role==='admin' && (
                    <td className="px-6 py-4">
                      <p style={{ color:'var(--text1)', fontWeight:600, fontSize:'0.85rem' }}>{f.student_name}</p>
                      <p style={{ color:'var(--text3)', fontSize:'0.75rem' }}>{f.roll_no}</p>
                    </td>
                  )}
                  <td className="px-6 py-4" style={T.cell}>{f.description || 'Tuition Fee'}</td>
                  <td className="px-6 py-4" style={{ color:'var(--text1)', fontWeight:700, fontSize:'0.9rem' }}>₹{Number(f.amount).toLocaleString()}</td>
                  <td className="px-6 py-4" style={T.cell}>{f.due_date ? new Date(f.due_date).toLocaleDateString() : '—'}</td>
                  <td className="px-6 py-4">
                    <span className={f.status==='paid' ? 'badge-paid' : 'badge-pending'}>{f.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    {role==='student' && f.status==='pending' ? (
                      <button onClick={() => setPayModal(f)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                        style={{ background:'rgba(34,197,94,0.10)', color:'var(--pd)', border:'1px solid rgba(34,197,94,0.25)' }}
                        onMouseEnter={e => e.currentTarget.style.background='rgba(34,197,94,0.18)'}
                        onMouseLeave={e => e.currentTarget.style.background='rgba(34,197,94,0.10)'}>
                        <CreditCard size={12}/> Pay Now
                      </button>
                    ) : f.status==='paid' ? (
                      <span className="flex items-center gap-1 text-xs font-semibold" style={{ color:'var(--p)' }}>
                        <CheckCircle size={12}/> Paid
                      </span>
                    ) : null}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Fee Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title="Add Fee Record">
        <form onSubmit={createFee} className="space-y-4">
          <div>
            <label className="block mb-1.5" style={T.lbl}>Student *</label>
            <select className="input-dark" value={form.student_id} onChange={set('student_id')} required>
              <option value="">Select student</option>
              {myStudents.map(s => <option key={s.id} value={s.id}>{s.name} ({s.roll_no})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block mb-1.5" style={T.lbl}>Amount (₹) *</label><input className="input-dark" type="number" placeholder="50000" value={form.amount} onChange={set('amount')} required/></div>
            <div><label className="block mb-1.5" style={T.lbl}>Due Date</label><input className="input-dark" type="date" value={form.due_date} onChange={set('due_date')}/></div>
          </div>
          <div><label className="block mb-1.5" style={T.lbl}>Description</label><input className="input-dark" placeholder="e.g. Semester 1 Tuition Fee" value={form.description} onChange={set('description')}/></div>
          <button type="submit" className="btn-primary w-full">Create Fee Record</button>
        </form>
      </Modal>

      {/* Payment Modal */}
      <Modal open={!!payModal} onClose={() => setPayModal(null)} title="Confirm Payment" size="sm">
        {payModal && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
              style={{ background:'rgba(34,197,94,0.12)' }}>
              <CreditCard size={26} style={{ color:'var(--p)' }}/>
            </div>
            <div>
              <p style={{ color:'var(--text1)', fontWeight:700, fontSize:'1.2rem' }}>₹{Number(payModal.amount).toLocaleString()}</p>
              <p style={{ color:'var(--text3)', fontSize:'0.85rem' }}>{payModal.description}</p>
            </div>
            <div className="rounded-xl p-4 text-left space-y-2"
              style={{ background:'var(--bg4)', border:'1px solid var(--border2)' }}>
              <p style={{ color:'var(--text3)', fontSize:'0.75rem', fontWeight:500 }}>Select Payment Method</p>
              <div className="flex gap-2">
                {['UPI','Card','Net Banking'].map(m => (
                  <div key={m} className="flex-1 py-2 rounded-lg text-center text-xs font-medium"
                    style={{ background:'var(--bg3)', border:'1px solid var(--border2)', color:'var(--text2)' }}>
                    {m}
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => simulatePay(payModal.id)} className="btn-primary w-full py-3">
              ✓ Confirm & Pay ₹{Number(payModal.amount).toLocaleString()}
            </button>
            <p style={{ color:'var(--text4)', fontSize:'0.72rem' }}>Demo simulation — no real payment processed.</p>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}

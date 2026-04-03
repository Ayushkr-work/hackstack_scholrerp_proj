import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const lbl = { color:'var(--text3)', fontSize:'0.72rem', fontWeight:500 };
const card = { background:'var(--bg3)', border:'1px solid var(--border2)', borderRadius:'16px', boxShadow:'var(--shadow)', padding:'1.5rem', transition:'box-shadow .2s, border-color .2s' };

export default function LeavePage() {
  const { role } = useAuth();
  const [leaves, setLeaves]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [modal, setModal]             = useState(false);
  const [remarkModal, setRemarkModal] = useState(null);
  const [form, setForm]               = useState({ reason:'', from_date:'', to_date:'' });
  const [remark, setRemark]           = useState('');
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const load = () => {
    setLoading(true);
    api.get('/leaves').then(d => setLeaves(Array.isArray(d) ? d : [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const submit = async e => {
    e.preventDefault();
    try { await api.post('/leaves', form); load(); setModal(false); setForm({ reason:'', from_date:'', to_date:'' }); }
    catch (err) { alert(err.message); }
  };

  const updateStatus = async (id, status) => {
    try { await api.put(`/leaves/${id}/status`, { status, admin_remark: remark }); load(); setRemarkModal(null); setRemark(''); }
    catch (err) { alert(err.message); }
  };

  const badge = s => ({ pending:'badge-pending', approved:'badge-approved', rejected:'badge-rejected' }[s]);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ color:'var(--text1)', fontWeight:900, fontSize:'1.4rem' }}>Leave Management</h1>
          <p style={{ color:'var(--text3)', fontSize:'0.8rem' }} className="mt-0.5">{leaves.length} total requests</p>
        </div>
        {role==='student' && <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2 text-sm"><Plus size={16}/> Apply Leave</button>}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3" style={{ color:'var(--text3)' }}>
          <Loader2 size={20} className="animate-spin" style={{ color:'var(--p)' }}/>
          <span style={{ fontSize:'0.875rem' }}>Loading...</span>
        </div>
      ) : leaves.length === 0 ? (
        <div className="rounded-2xl p-14 text-center" style={{ background:'var(--bg3)', border:'1px solid var(--border2)', boxShadow:'var(--shadow)' }}>
          <Calendar size={40} style={{ margin:'0 auto 12px', color:'var(--text4)' }}/>
          <p style={{ color:'var(--text3)', fontSize:'0.85rem' }}>No leave requests found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {leaves.map((l, i) => (
            <motion.div key={l.id} style={card} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*.05 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.boxShadow='var(--shadow-h)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border2)'; e.currentTarget.style.boxShadow='var(--shadow)'; }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    {role==='admin' && <span style={{ color:'var(--p)', fontWeight:700, fontSize:'0.85rem' }}>{l.student_name} ({l.roll_no})</span>}
                    <span className={badge(l.status)}>{l.status}</span>
                    <span style={{ color:'var(--text3)', fontSize:'0.75rem' }}>{new Date(l.from_date).toLocaleDateString()} → {new Date(l.to_date).toLocaleDateString()}</span>
                  </div>
                  <p style={{ color:'var(--text2)', fontSize:'0.875rem' }}>{l.reason}</p>
                  {l.admin_remark && <p style={{ color:'var(--text3)', fontSize:'0.75rem', marginTop:'0.5rem', fontStyle:'italic' }}>Remark: {l.admin_remark}</p>}
                  <p style={{ color:'var(--text4)', fontSize:'0.72rem', marginTop:'0.5rem' }}>Applied: {new Date(l.created_at).toLocaleDateString()}</p>
                </div>
                {role==='admin' && l.status==='pending' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => setRemarkModal({ id:l.id, action:'approved' })}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all"
                      style={{ background:'rgba(34,197,94,0.10)', color:'#15803D', border:'1px solid rgba(34,197,94,0.25)' }}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(34,197,94,0.18)'}
                      onMouseLeave={e => e.currentTarget.style.background='rgba(34,197,94,0.10)'}>
                      <CheckCircle size={14}/> Approve
                    </button>
                    <button onClick={() => setRemarkModal({ id:l.id, action:'rejected' })}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all"
                      style={{ background:'rgba(239,68,68,0.10)', color:'#DC2626', border:'1px solid rgba(239,68,68,0.25)' }}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.18)'}
                      onMouseLeave={e => e.currentTarget.style.background='rgba(239,68,68,0.10)'}>
                      <XCircle size={14}/> Reject
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Apply for Leave">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block mb-1.5" style={lbl}>From Date *</label><input className="input-dark" type="date" value={form.from_date} onChange={set('from_date')} required/></div>
            <div><label className="block mb-1.5" style={lbl}>To Date *</label><input className="input-dark" type="date" value={form.to_date} onChange={set('to_date')} required/></div>
          </div>
          <div><label className="block mb-1.5" style={lbl}>Reason *</label><textarea className="input-dark resize-none" rows={4} placeholder="Reason for leave..." value={form.reason} onChange={set('reason')} required/></div>
          <button type="submit" className="btn-primary w-full">Submit Application</button>
        </form>
      </Modal>

      <Modal open={!!remarkModal} onClose={() => setRemarkModal(null)} title={`${remarkModal?.action==='approved'?'Approve':'Reject'} Leave`} size="sm">
        <div className="space-y-4">
          <div><label className="block mb-1.5" style={lbl}>Admin Remark (optional)</label><textarea className="input-dark resize-none" rows={3} placeholder="Add a remark..." value={remark} onChange={e=>setRemark(e.target.value)}/></div>
          <button onClick={() => updateStatus(remarkModal.id, remarkModal.action)}
            className="w-full py-3 rounded-xl font-semibold transition-all text-sm"
            style={remarkModal?.action==='approved'
              ? { background:'rgba(34,197,94,0.12)', color:'#15803D', border:'1px solid rgba(34,197,94,0.30)' }
              : { background:'rgba(239,68,68,0.12)', color:'#DC2626', border:'1px solid rgba(239,68,68,0.30)' }}>
            Confirm {remarkModal?.action==='approved' ? 'Approval' : 'Rejection'}
          </button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

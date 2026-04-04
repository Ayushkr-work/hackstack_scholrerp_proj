import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Plus, Loader2, AlertTriangle, CheckCircle, Clock,
  RotateCcw, Copy, Upload, FileText, Download, ChevronDown,
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const lbl = { color:'var(--text3)', fontSize:'0.72rem', fontWeight:500 };
const BASE = 'http://localhost:5000/api';
const getToken = () => localStorage.getItem('token');

const XEROX_STATUS_COLORS = {
  pending:    { bg:'rgba(245,158,11,0.12)',  color:'#F59E0B' },
  processing: { bg:'rgba(129,140,248,0.12)', color:'#818CF8' },
  ready:      { bg:'rgba(34,197,94,0.12)',   color:'#22C55E' },
  collected:  { bg:'rgba(107,114,128,0.12)', color:'#6B7280' },
};

export default function LibraryPage() {
  const { role } = useAuth();
  const [tab,      setTab]      = useState('books');
  const [records,  setRecords]  = useState([]);
  const [students, setStudents] = useState([]);
  const [xerox,    setXerox]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [form,     setForm]     = useState({ student_id:'', book_name:'', book_author:'', issue_date:'', due_date:'', fine_per_day:5 });

  // Xerox form state
  const [xFile,    setXFile]    = useState(null);
  const [xForm,    setXForm]    = useState({ copies:1, color:'bw', sides:'single', note:'' });
  const [xModal,   setXModal]   = useState(false);
  const [xLoading, setXLoading] = useState(false);
  const fileRef = useRef();

  const load = () => {
    setLoading(true);
    const reqs = [api.get('/library'), api.get('/library/xerox')];
    if (role === 'admin') reqs.push(api.get('/students'));
    Promise.all(reqs).then(([lib, xr, stu]) => {
      setRecords(Array.isArray(lib) ? lib : []);
      setXerox(Array.isArray(xr) ? xr : []);
      if (stu) setStudents(Array.isArray(stu) ? stu : []);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  const submit = async e => {
    e.preventDefault();
    try { await api.post('/library', form); setModal(false); setForm({ student_id:'', book_name:'', book_author:'', issue_date:'', due_date:'', fine_per_day:5 }); load(); }
    catch (err) { alert(err.message); }
  };

  const returnBook   = async id => { if (!window.confirm('Mark as returned?')) return; try { await api.put(`/library/${id}/return`, {}); load(); } catch (err) { alert(err.message); } };
  const deleteRecord = async id => { if (!window.confirm('Delete record?')) return; try { await api.delete(`/library/${id}`); load(); } catch (err) { alert(err.message); } };

  // Xerox submit (multipart)
  const submitXerox = async e => {
    e.preventDefault();
    if (!xFile) return alert('Please select a PDF file');
    setXLoading(true);
    try {
      const fd = new FormData();
      fd.append('pdf', xFile);
      fd.append('copies', xForm.copies);
      fd.append('color',  xForm.color);
      fd.append('sides',  xForm.sides);
      fd.append('note',   xForm.note);
      const res = await fetch(`${BASE}/library/xerox`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setXModal(false); setXFile(null); setXForm({ copies:1, color:'bw', sides:'single', note:'' });
      load();
    } catch (err) { alert(err.message); }
    finally { setXLoading(false); }
  };

  const updateXeroxStatus = async (id, status) => {
    const admin_note = status === 'ready' ? 'Your printout is ready for collection.' : '';
    try { await api.put(`/library/xerox/${id}/status`, { status, admin_note }); load(); }
    catch (err) { alert(err.message); }
  };

  const downloadFile = async (id, fileName) => {
    const res = await fetch(`${BASE}/library/xerox/${id}/download`, { headers: { Authorization: `Bearer ${getToken()}` } });
    if (!res.ok) return alert('File not found');
    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a'); a.href = url; a.download = fileName; a.click();
    URL.revokeObjectURL(url);
  };

  const totalFine  = records.reduce((s, r) => s + (r.fine_amount || 0), 0);
  const overdue    = records.filter(r => !r.is_returned && r.overdue_days > 0).length;
  const active     = records.filter(r => !r.is_returned).length;
  const pendingXerox = xerox.filter(x => x.status === 'pending').length;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ color:'var(--text1)', fontWeight:900, fontSize:'1.4rem' }}>Library</h1>
          <p style={{ color:'var(--text3)', fontSize:'0.8rem' }} className="mt-0.5">
            {role === 'admin' ? 'Manage books and xerox requests' : 'Your books and xerox requests'}
          </p>
        </div>
        <div className="flex gap-2">
          {role === 'student' && (
            <button onClick={() => setXModal(true)}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl font-semibold transition-all"
              style={{ background:'rgba(129,140,248,0.12)', color:'#818CF8', border:'1px solid rgba(129,140,248,0.25)' }}>
              <Copy size={15}/> Xerox Request
            </button>
          )}
          {role === 'admin' && (
            <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2 text-sm">
              <Plus size={16}/> Issue Book
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label:'Active Books',    value: active,                     icon: BookOpen,      color:'#22C55E' },
          { label:'Overdue',         value: overdue,                    icon: AlertTriangle, color:'#EF4444' },
          { label:'Total Fine',      value: `₹${totalFine.toFixed(0)}`, icon: Clock,         color:'#D4AF37' },
          { label:'Xerox Requests',  value: pendingXerox,               icon: Copy,          color:'#818CF8' },
        ].map(({ label, value, icon:Icon, color }) => (
          <motion.div key={label} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            className="rounded-2xl p-5"
            style={{ background:'var(--bg3)', border:'1px solid var(--border2)', boxShadow:'var(--shadow)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:`${color}18` }}>
                <Icon size={18} style={{ color }}/>
              </div>
              <div>
                <p style={{ color:'var(--text3)', fontSize:'0.72rem', fontWeight:500 }}>{label}</p>
                <p style={{ color:'var(--text1)', fontWeight:800, fontSize:'1.3rem', lineHeight:1 }}>{value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {['books','xerox'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-5 py-2 rounded-xl text-sm font-semibold capitalize transition-all"
            style={{
              background: tab === t ? 'var(--p)' : 'var(--bg3)',
              color:      tab === t ? '#fff'     : 'var(--text3)',
              border:     `1px solid ${tab === t ? 'var(--p)' : 'var(--border2)'}`,
            }}>
            {t === 'books' ? '📚 Books' : '🖨️ Xerox'}
            {t === 'xerox' && pendingXerox > 0 && (
              <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background:'rgba(255,255,255,0.25)' }}>{pendingXerox}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── BOOKS TAB ── */}
      {tab === 'books' && (
        <div className="rounded-2xl overflow-hidden"
          style={{ background:'var(--bg3)', border:'1px solid var(--border2)', boxShadow:'var(--shadow)' }}>
          <div className="px-6 py-4" style={{ borderBottom:'1px solid var(--border2)', background:'var(--bg4)' }}>
            <h2 style={{ color:'var(--text1)', fontWeight:700 }}>Book Records</h2>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader2 size={22} className="animate-spin" style={{ color:'var(--p)' }}/></div>
          ) : records.length === 0 ? (
            <div className="py-14 text-center"><BookOpen size={40} style={{ margin:'0 auto 12px', color:'var(--text4)' }}/><p style={{ color:'var(--text3)', fontSize:'0.85rem' }}>No library records found</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom:'1px solid var(--border2)' }}>
                    {[...(role==='admin'?['Student']:[]),'Book','Author','Issue Date','Due Date','Return Date','Fine','Status',...(role==='admin'?['Actions']:[])].map(h => (
                      <th key={h} className="text-left px-5 py-3"
                        style={{ color:'var(--text3)', fontSize:'0.7rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.map((r, i) => (
                    <motion.tr key={r.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.03 }}
                      style={{ borderBottom:'1px solid var(--border2)', transition:'background .15s' }}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(34,197,94,0.04)'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      {role==='admin' && <td className="px-5 py-3"><p style={{ color:'var(--text1)', fontWeight:600, fontSize:'0.85rem' }}>{r.student_name}</p><p style={{ color:'var(--text3)', fontSize:'0.75rem' }}>{r.roll_no}</p></td>}
                      <td className="px-5 py-3" style={{ color:'var(--text1)', fontWeight:600, fontSize:'0.85rem' }}>{r.book_name}</td>
                      <td className="px-5 py-3" style={{ color:'var(--text3)', fontSize:'0.85rem' }}>{r.book_author||'—'}</td>
                      <td className="px-5 py-3" style={{ color:'var(--text2)', fontSize:'0.85rem' }}>{new Date(r.issue_date).toLocaleDateString('en-IN')}</td>
                      <td className="px-5 py-3" style={{ color:'var(--text2)', fontSize:'0.85rem' }}>{new Date(r.due_date).toLocaleDateString('en-IN')}</td>
                      <td className="px-5 py-3" style={{ color:'var(--text3)', fontSize:'0.85rem' }}>{r.return_date?new Date(r.return_date).toLocaleDateString('en-IN'):'—'}</td>
                      <td className="px-5 py-3">{r.fine_amount>0?<span style={{ color:'#EF4444', fontWeight:700, fontSize:'0.85rem' }}>₹{r.fine_amount.toFixed(0)}{!r.is_returned&&<span style={{ fontSize:'0.7rem', fontWeight:400 }}> ({r.overdue_days}d)</span>}</span>:<span style={{ color:'var(--text4)', fontSize:'0.85rem' }}>₹0</span>}</td>
                      <td className="px-5 py-3">{r.is_returned?<span className="flex items-center gap-1 text-xs font-semibold" style={{ color:'#22C55E' }}><CheckCircle size={12}/>Returned</span>:r.overdue_days>0?<span className="flex items-center gap-1 text-xs font-semibold" style={{ color:'#EF4444' }}><AlertTriangle size={12}/>Overdue</span>:<span className="flex items-center gap-1 text-xs font-semibold" style={{ color:'#D4AF37' }}><Clock size={12}/>Active</span>}</td>
                      {role==='admin' && <td className="px-5 py-3"><div className="flex items-center gap-2">{!r.is_returned&&<button onClick={()=>returnBook(r.id)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold" style={{ background:'rgba(34,197,94,0.10)', color:'#22C55E', border:'1px solid rgba(34,197,94,0.20)' }}><RotateCcw size={11}/>Return</button>}<button onClick={()=>deleteRecord(r.id)} className="px-2.5 py-1.5 rounded-lg text-xs font-semibold" style={{ background:'rgba(239,68,68,0.08)', color:'#EF4444', border:'1px solid rgba(239,68,68,0.15)' }}>Delete</button></div></td>}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── XEROX TAB ── */}
      {tab === 'xerox' && (
        <div className="rounded-2xl overflow-hidden"
          style={{ background:'var(--bg3)', border:'1px solid var(--border2)', boxShadow:'var(--shadow)' }}>
          <div className="px-6 py-4" style={{ borderBottom:'1px solid var(--border2)', background:'var(--bg4)' }}>
            <h2 style={{ color:'var(--text1)', fontWeight:700 }}>Xerox Requests</h2>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader2 size={22} className="animate-spin" style={{ color:'#818CF8' }}/></div>
          ) : xerox.length === 0 ? (
            <div className="py-14 text-center">
              <Copy size={40} style={{ margin:'0 auto 12px', color:'var(--text4)' }}/>
              <p style={{ color:'var(--text3)', fontSize:'0.85rem' }}>No xerox requests yet</p>
              {role === 'student' && <button onClick={() => setXModal(true)} className="mt-4 btn-primary text-sm px-5 py-2">Submit Xerox Request</button>}
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {xerox.map((x, i) => {
                const sc = XEROX_STATUS_COLORS[x.status] || XEROX_STATUS_COLORS.pending;
                return (
                  <motion.div key={x.id} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.04 }}
                    className="rounded-xl p-4" style={{ background:'var(--bg4)', border:'1px solid var(--border2)' }}>
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background:'rgba(129,140,248,0.12)' }}>
                          <FileText size={18} style={{ color:'#818CF8' }}/>
                        </div>
                        <div className="min-w-0">
                          <p style={{ color:'var(--text1)', fontWeight:700, fontSize:'0.9rem' }} className="truncate">{x.file_name}</p>
                          {role === 'admin' && <p style={{ color:'var(--text3)', fontSize:'0.78rem' }}>{x.student_name} · {x.roll_no}</p>}
                          <div className="flex flex-wrap gap-3 mt-1" style={{ fontSize:'0.75rem', color:'var(--text3)' }}>
                            <span>📄 {x.copies} {x.copies>1?'copies':'copy'}</span>
                            <span>{x.color === 'color' ? '🎨 Color' : '⬛ B&W'}</span>
                            <span>{x.sides === 'double' ? '↔️ Double-sided' : '➡️ Single-sided'}</span>
                            <span style={{ color:'var(--text4)' }}>{new Date(x.created_at).toLocaleDateString('en-IN')}</span>
                          </div>
                          {x.note && <p className="mt-1 text-xs" style={{ color:'var(--text3)' }}>Note: {x.note}</p>}
                          {x.admin_note && <p className="mt-1 text-xs" style={{ color:'#22C55E' }}>✓ {x.admin_note}</p>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 flex-wrap">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold capitalize"
                          style={{ background: sc.bg, color: sc.color }}>{x.status}</span>

                        <button onClick={() => downloadFile(x.id, x.file_name)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold"
                          style={{ background:'rgba(129,140,248,0.10)', color:'#818CF8', border:'1px solid rgba(129,140,248,0.20)' }}>
                          <Download size={11}/> PDF
                        </button>

                        {role === 'admin' && x.status !== 'collected' && (
                          <div className="relative group">
                            <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold"
                              style={{ background:'rgba(34,197,94,0.10)', color:'#22C55E', border:'1px solid rgba(34,197,94,0.20)' }}>
                              Update <ChevronDown size={11}/>
                            </button>
                            <div className="absolute right-0 top-full mt-1 rounded-xl overflow-hidden z-20 hidden group-hover:block"
                              style={{ background:'var(--bg3)', border:'1px solid var(--border)', boxShadow:'var(--shadow)', minWidth:'130px' }}>
                              {['pending','processing','ready','collected'].filter(s=>s!==x.status).map(s => (
                                <button key={s} onClick={() => updateXeroxStatus(x.id, s)}
                                  className="w-full text-left px-4 py-2 text-xs capitalize transition-colors"
                                  style={{ color:'var(--text2)' }}
                                  onMouseEnter={e=>e.currentTarget.style.background='var(--bg4)'}
                                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Issue Book Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title="Issue Book to Student">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block mb-1.5" style={lbl}>Student *</label>
            <select className="input-dark" value={form.student_id} onChange={e=>setForm(p=>({...p,student_id:e.target.value}))} required>
              <option value="">Select student</option>
              {students.map(s=><option key={s.id} value={s.id}>{s.name} ({s.roll_no})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block mb-1.5" style={lbl}>Book Name *</label><input className="input-dark" placeholder="e.g. Data Structures" value={form.book_name} onChange={e=>setForm(p=>({...p,book_name:e.target.value}))} required/></div>
            <div><label className="block mb-1.5" style={lbl}>Author</label><input className="input-dark" placeholder="e.g. Cormen" value={form.book_author} onChange={e=>setForm(p=>({...p,book_author:e.target.value}))}/></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block mb-1.5" style={lbl}>Issue Date *</label><input className="input-dark" type="date" value={form.issue_date} onChange={e=>setForm(p=>({...p,issue_date:e.target.value}))} required/></div>
            <div><label className="block mb-1.5" style={lbl}>Due Date *</label><input className="input-dark" type="date" value={form.due_date} onChange={e=>setForm(p=>({...p,due_date:e.target.value}))} required/></div>
          </div>
          <div><label className="block mb-1.5" style={lbl}>Fine per Day (₹)</label><input className="input-dark" type="number" min="0" step="0.5" value={form.fine_per_day} onChange={e=>setForm(p=>({...p,fine_per_day:e.target.value}))}/></div>
          <button type="submit" className="btn-primary w-full">Issue Book</button>
        </form>
      </Modal>

      {/* Xerox Request Modal */}
      <Modal open={xModal} onClose={() => { setXModal(false); setXFile(null); }} title="Submit Xerox Request">
        <form onSubmit={submitXerox} className="space-y-4">
          {/* File upload */}
          <div>
            <label className="block mb-1.5" style={lbl}>PDF File *</label>
            <div
              onClick={() => fileRef.current.click()}
              className="rounded-xl p-6 text-center transition-all cursor-pointer"
              style={{ border:`2px dashed ${xFile ? '#818CF8' : 'var(--border)'}`, background: xFile ? 'rgba(129,140,248,0.06)' : 'var(--bg4)' }}>
              <input ref={fileRef} type="file" accept=".pdf" className="hidden"
                onChange={e => setXFile(e.target.files[0] || null)}/>
              {xFile ? (
                <div className="flex items-center justify-center gap-2">
                  <FileText size={20} style={{ color:'#818CF8' }}/>
                  <span style={{ color:'#818CF8', fontWeight:600, fontSize:'0.85rem' }}>{xFile.name}</span>
                </div>
              ) : (
                <>
                  <Upload size={24} style={{ margin:'0 auto 8px', color:'var(--text4)' }}/>
                  <p style={{ color:'var(--text3)', fontSize:'0.85rem' }}>Click to upload PDF</p>
                  <p style={{ color:'var(--text4)', fontSize:'0.75rem', marginTop:'4px' }}>Max 20MB</p>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block mb-1.5" style={lbl}>Copies</label>
              <input className="input-dark" type="number" min="1" max="50" value={xForm.copies}
                onChange={e=>setXForm(p=>({...p,copies:e.target.value}))}/>
            </div>
            <div>
              <label className="block mb-1.5" style={lbl}>Print Type</label>
              <select className="input-dark" value={xForm.color} onChange={e=>setXForm(p=>({...p,color:e.target.value}))}>
                <option value="bw">B&W</option>
                <option value="color">Color</option>
              </select>
            </div>
            <div>
              <label className="block mb-1.5" style={lbl}>Sides</label>
              <select className="input-dark" value={xForm.sides} onChange={e=>setXForm(p=>({...p,sides:e.target.value}))}>
                <option value="single">Single</option>
                <option value="double">Double</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1.5" style={lbl}>Additional Note</label>
            <textarea className="input-dark" rows={2} placeholder="Any special instructions..."
              value={xForm.note} onChange={e=>setXForm(p=>({...p,note:e.target.value}))}/>
          </div>

          <button type="submit" disabled={xLoading} className="btn-primary w-full flex items-center justify-center gap-2">
            {xLoading
              ? <><Loader2 size={15} className="animate-spin"/> Uploading...</>
              : <><Copy size={15}/> Submit Xerox Request</>
            }
          </button>
        </form>
      </Modal>
    </DashboardLayout>
  );
}

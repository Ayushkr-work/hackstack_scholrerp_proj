import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Mail, Phone, MapPin, BookOpen, Hash, User } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';

const lbl = { color:'var(--text3)', fontSize:'0.72rem', fontWeight:500 };

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name:'', roll_no:'', department:'', semester:1, phone:'', address:'' });
  const [saved, setSaved] = useState(false);
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  useEffect(() => {
    if (user) setForm({ name:user.name||'', roll_no:user.roll_no||'', department:user.department||'', semester:user.semester||1, phone:user.phone||'', address:user.address||'' });
  }, [user]);

  const submit = e => {
    e.preventDefault();
    updateUser(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const info = [
    { icon:Mail,     label:'Email',      value:user?.email },
    { icon:Hash,     label:'Roll No',    value:user?.roll_no || 'Not set' },
    { icon:BookOpen, label:'Department', value:user?.department || 'Not set' },
    { icon:User,     label:'Semester',   value:user?.semester ? `Semester ${user.semester}` : 'Not set' },
    { icon:Phone,    label:'Phone',      value:user?.phone || 'Not set' },
    { icon:MapPin,   label:'Address',    value:user?.address || 'Not set' },
  ];

  return (
    <DashboardLayout>
      <h1 style={{ color:'var(--text1)', fontWeight:900, fontSize:'1.4rem' }} className="mb-6">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
          className="text-center"
          style={{ background:'var(--bg3)', border:'1px solid var(--border2)', borderRadius:'18px', padding:'1.5rem', boxShadow:'var(--shadow)' }}>
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-4"
            style={{ background:'linear-gradient(135deg,#22C55E,#15803D)', boxShadow:'0 8px 24px rgba(34,197,94,0.30)' }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <h2 style={{ color:'var(--text1)', fontWeight:800, fontSize:'1.1rem' }} className="mb-1">{user?.name}</h2>
          <p style={{ color:'var(--p)', fontSize:'0.85rem' }} className="mb-5">{user?.email}</p>

          <div className="space-y-2 text-left">
            {info.map(({ icon:Icon, label, value }, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl"
                style={{ background:'var(--bg4)', border:'1px solid var(--border2)' }}>
                <Icon size={13} style={{ color:'var(--text3)', flexShrink:0 }}/>
                <div className="overflow-hidden">
                  <p style={{ color:'var(--text4)', fontSize:'0.68rem', fontWeight:500 }}>{label}</p>
                  <p style={{ color:'var(--text1)', fontSize:'0.82rem', fontWeight:500 }} className="truncate">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Edit form */}
        <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
          className="lg:col-span-2"
          style={{ background:'var(--bg3)', border:'1px solid var(--border2)', borderRadius:'18px', padding:'1.5rem', boxShadow:'var(--shadow)' }}>
          <h2 style={{ color:'var(--text1)', fontWeight:700, fontSize:'1rem' }} className="mb-6">Edit Information</h2>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { k:'name',       label:'Full Name',   ph:'Your name'        },
                { k:'roll_no',    label:'Roll Number', ph:'CS2024001'        },
                { k:'department', label:'Department',  ph:'Computer Science' },
                { k:'phone',      label:'Phone',       ph:'+91 XXXXX XXXXX' },
                { k:'address',    label:'Address',     ph:'City, State'      },
              ].map(({ k, label, ph }) => (
                <div key={k}>
                  <label className="block mb-1.5" style={lbl}>{label}</label>
                  <input className="input-dark" placeholder={ph} value={form[k]} onChange={set(k)}/>
                </div>
              ))}
              <div>
                <label className="block mb-1.5" style={lbl}>Semester</label>
                <select className="input-dark" value={form.semester} onChange={set('semester')}>
                  {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>
            </div>
            <motion.button type="submit" className="btn-primary flex items-center gap-2"
              whileHover={{ scale:1.02 }} whileTap={{ scale:.98 }}>
              {saved ? '✓ Saved!' : <><Save size={16}/> Save Changes</>}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

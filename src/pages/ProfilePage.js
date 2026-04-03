import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Mail, Phone, MapPin, BookOpen, Hash, User } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name:'', roll_no:'', department:'', semester:1, phone:'', address:'' });
  const [saved, setSaved] = useState(false);
  const set = k => e => setForm(p => ({ ...p, [k]:e.target.value }));

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
    { icon:Mail,    label:'Email',      value:user?.email },
    { icon:Hash,    label:'Roll No',    value:user?.roll_no||'Not set' },
    { icon:BookOpen,label:'Department', value:user?.department||'Not set' },
    { icon:User,    label:'Semester',   value:user?.semester?`Semester ${user.semester}`:'Not set' },
    { icon:Phone,   label:'Phone',      value:user?.phone||'Not set' },
    { icon:MapPin,  label:'Address',    value:user?.address||'Not set' },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-black text-white mb-6">My Profile</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div className="glass rounded-2xl p-6 border border-white/5 text-center"
          initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}}
          style={{background:'linear-gradient(135deg,rgba(0,240,255,.05),rgba(168,85,247,.05))'}}>
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-dark-900 font-black text-4xl mx-auto mb-4">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <h2 className="text-xl font-black text-white mb-1">{user?.name}</h2>
          <p className="text-cyan-400 text-sm mb-4">{user?.email}</p>
          <div className="space-y-2">
            {info.map(({ icon:Icon, label, value }, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/5 text-left">
                <Icon size={14} className="text-white/40 shrink-0"/>
                <div className="overflow-hidden">
                  <p className="text-xs text-white/30">{label}</p>
                  <p className="text-sm text-white truncate">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="lg:col-span-2 glass rounded-2xl p-6 border border-white/5"
          initial={{opacity:0,x:20}} animate={{opacity:1,x:0}}>
          <h2 className="font-bold text-white mb-6">Edit Information</h2>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                {k:'name',       label:'Full Name',   ph:'Your name'         },
                {k:'roll_no',    label:'Roll Number', ph:'CS2024001'         },
                {k:'department', label:'Department',  ph:'Computer Science'  },
                {k:'phone',      label:'Phone',       ph:'+91 XXXXX XXXXX'  },
                {k:'address',    label:'Address',     ph:'City, State'       },
              ].map(({k,label,ph}) => (
                <div key={k}>
                  <label className="text-xs text-white/50 mb-1.5 block">{label}</label>
                  <input className="input-dark" placeholder={ph} value={form[k]} onChange={set(k)}/>
                </div>
              ))}
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Semester</label>
                <select className="input-dark" value={form.semester} onChange={set('semester')}>
                  {[1,2,3,4,5,6,7,8].map(s=><option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>
            </div>
            <motion.button type="submit" className="btn-primary flex items-center gap-2" whileHover={{scale:1.02}} whileTap={{scale:.98}}>
              {saved ? '✓ Saved!' : <><Save size={16}/> Save Changes</>}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

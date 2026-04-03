import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, CreditCard, Bell, Calendar, Briefcase, TrendingUp, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import DashboardLayout from '../components/DashboardLayout';
import Chatbot from '../components/Chatbot';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api';
const chartData = [
  { month:'Jan', students:40, fees:180000 },
  { month:'Feb', students:55, fees:247500 },
  { month:'Mar', students:70, fees:315000 },
  { month:'Apr', students:65, fees:292500 },
  { month:'May', students:90, fees:405000 },
  { month:'Jun', students:110, fees:495000 },
];

const f = (i, d=0) => ({ initial:{opacity:0,y:18}, animate:{opacity:1,y:0}, transition:{delay:d+i*.06,duration:.32,ease:'easeOut'} });

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-4 py-3 text-xs" style={{ background:'var(--bg4)', border:'1px solid var(--border)', boxShadow:'0 12px 32px rgba(0,0,0,0.3)' }}>
      <p className="font-bold mb-2" style={{ color:'var(--text1)' }}>{label}</p>
      {payload.map((p,i) => (
        <p key={i} className="flex items-center gap-2" style={{ color:p.color }}>
          <span className="w-2 h-2 rounded-full inline-block" style={{ background:p.color }}/>
          {p.name}: {p.name==='fees'?'₹':''}{Number(p.value).toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  const [stats, setStats]   = useState({ total_students:0, fees_collected:0, pending_leaves:0, total_notices:0, total_placements:0 });
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${API}/students/dashboard/stats`, { headers }).then(r => r.json()).catch(() => ({})),
      fetch(`${API}/notices`, { headers }).then(r => r.json()).catch(() => []),
    ]).then(([s, n]) => {
      if (s && !s.message) setStats(s);
      if (Array.isArray(n)) setNotices(n.slice(0, 4));
    }).finally(() => setLoading(false));
  }, [token]);

  const statCards = [
    { label:'Total Students',  value: stats.total_students,                                    icon:Users,      color:'#22C55E', bg:'rgba(34,197,94,0.12)',   change:'' },
    { label:'Fees Collected',  value:`₹${Number(stats.fees_collected||0).toLocaleString()}`,   icon:CreditCard, color:'#D4AF37', bg:'rgba(212,175,55,0.12)',  change:'' },
    { label:'Pending Leaves',  value: stats.pending_leaves,                                    icon:Calendar,   color:'#F59E0B', bg:'rgba(245,158,11,0.12)',  change:'' },
    { label:'Active Notices',  value: stats.total_notices,                                     icon:Bell,       color:'#4ADE80', bg:'rgba(74,222,128,0.12)',  change:'' },
    { label:'Placements',      value: stats.total_placements,                                  icon:Briefcase,  color:'#D4AF37', bg:'rgba(212,175,55,0.12)',  change:'' },
  ];

  return (
    <DashboardLayout>
      <motion.div className="mb-8" {...f(0)}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background:'#22C55E' }}/>
          <span className="text-xs font-medium" style={{ color:'var(--text3)' }}>Live Dashboard</span>
        </div>
        <h1 className="text-2xl font-black" style={{ color:'var(--text1)' }}>
          Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-sm mt-1" style={{ color:'var(--text3)' }}>Here's your college overview for today.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map(({ label, value, icon:Icon, color, bg, change }, i) => (
          <motion.div key={i} {...f(i,0.05)} className="stat-card">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:bg }}>
                <Icon size={18} style={{ color }}/>
              </div>
              {change && (
                <span className="flex items-center gap-0.5 text-xs font-bold" style={{ color:'#22C55E' }}>
                  <TrendingUp size={10}/>{change}
                </span>
              )}
            </div>
            <p className="text-2xl font-black mb-0.5" style={{ color:'var(--text1)' }}>
              {loading ? '—' : value}
            </p>
            <p className="text-xs" style={{ color:'var(--text3)' }}>{label}</p>
            <div className="absolute bottom-0 right-0 w-20 h-20 rounded-full opacity-15 blur-2xl pointer-events-none" style={{ background:color }}/>
          </motion.div>
        ))}
      </div>

      {/* Chart + Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <motion.div {...f(6)} className="lg:col-span-2 card-flat p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-sm" style={{ color:'var(--text1)' }}>Enrollment & Revenue</h2>
              <p className="text-xs mt-0.5" style={{ color:'var(--text3)' }}>6-month performance</p>
            </div>
            <div className="flex items-center gap-4">
              {[{c:'#22C55E',l:'Students'},{c:'#D4AF37',l:'Revenue'}].map(({c,l}) => (
                <span key={l} className="flex items-center gap-1.5 text-xs" style={{ color:'var(--text3)' }}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background:c }}/>{l}
                </span>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{ top:5, right:5, bottom:0, left:0 }}>
              <defs>
                <linearGradient id="gS" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22C55E" stopOpacity={.25}/>
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gF" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#D4AF37" stopOpacity={.25}/>
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border2)" vertical={false}/>
              <XAxis dataKey="month" stroke="transparent" tick={{ fill:'var(--text3)', fontSize:11 }} axisLine={false}/>
              <YAxis stroke="transparent" tick={{ fill:'var(--text3)', fontSize:11 }} axisLine={false}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Area type="monotone" dataKey="students" name="students" stroke="#22C55E" fill="url(#gS)" strokeWidth={2.5} dot={false} activeDot={{ r:4, fill:'#22C55E' }}/>
              <Area type="monotone" dataKey="fees"     name="fees"     stroke="#D4AF37" fill="url(#gF)" strokeWidth={2.5} dot={false} activeDot={{ r:4, fill:'#D4AF37' }}/>
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div {...f(7)} className="card-flat p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-sm" style={{ color:'var(--text1)' }}>Recent Notices</h2>
            <Activity size={14} style={{ color:'var(--text3)' }}/>
          </div>
          {notices.length === 0
            ? <p className="text-xs text-center py-8" style={{ color:'var(--text3)' }}>No notices yet</p>
            : <div className="space-y-2">
                {notices.map((n,i) => (
                  <div key={i} className="p-3 rounded-xl transition-all"
                    style={{ background:'var(--bg4)', border:'1px solid var(--border2)' }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor='var(--border)'}
                    onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border2)'}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-xs font-semibold line-clamp-1" style={{ color:'var(--text1)' }}>{n.title}</p>
                      <span className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded-full font-semibold
                        ${n.priority==='high'?'bg-red-500/15 text-red-400':n.priority==='medium'?'bg-amber-500/15 text-amber-400':'bg-emerald-500/15 text-emerald-400'}`}>
                        {n.priority}
                      </span>
                    </div>
                    <p className="text-[11px] line-clamp-2" style={{ color:'var(--text3)' }}>{n.description}</p>
                  </div>
                ))}
              </div>
          }
        </motion.div>
      </div>
      <Chatbot/>
    </DashboardLayout>
  );
}

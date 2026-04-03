import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, CreditCard, Bell, Calendar, Briefcase, User, HeadphonesIcon, ArrowRight } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Chatbot from '../components/Chatbot';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const f = (i) => ({ initial:{opacity:0,y:18}, animate:{opacity:1,y:0}, transition:{delay:i*.07,duration:.32,ease:'easeOut'} });

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [fees,    setFees]    = useState([]);
  const [notices, setNotices] = useState([]);
  const [leaves,  setLeaves]  = useState([]);

  useEffect(() => {
    api.get('/fees').then(d => setFees(Array.isArray(d) ? d : [])).catch(() => {});
    api.get('/notices').then(d => setNotices(Array.isArray(d) ? d : [])).catch(() => {});
    api.get('/leaves').then(d => setLeaves(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  const pendingFees   = fees.filter(f => f.status === 'pending');
  const pendingLeaves = leaves.filter(l => l.status === 'pending');

  const links = [
    { label:'Results',    icon:FileText,      to:'/student/results',    color:'#22C55E', bg:'rgba(34,197,94,0.10)'   },
    { label:'Pay Fees',   icon:CreditCard,    to:'/student/fees',       color:'#D4AF37', bg:'rgba(212,175,55,0.10)',  badge:pendingFees.length   },
    { label:'Notices',    icon:Bell,          to:'/student/notices',    color:'#22C55E', bg:'rgba(34,197,94,0.10)',   badge:notices.length       },
    { label:'Leave',      icon:Calendar,      to:'/student/leaves',     color:'#F59E0B', bg:'rgba(245,158,11,0.10)',  badge:pendingLeaves.length },
    { label:'Placements', icon:Briefcase,     to:'/student/placements', color:'#D4AF37', bg:'rgba(212,175,55,0.10)' },
    { label:'Helpdesk',   icon:HeadphonesIcon,to:'/student/helpdesk',   color:'#22C55E', bg:'rgba(34,197,94,0.10)'  },
    { label:'Profile',    icon:User,          to:'/student/profile',    color:'#6B7280', bg:'rgba(107,114,128,0.10)' },
  ];

  return (
    <DashboardLayout>
      {/* Hero */}
      <motion.div {...f(0)} className="relative rounded-2xl overflow-hidden mb-8 p-6 md:p-8"
        style={{ background:'linear-gradient(135deg,rgba(34,197,94,0.10),rgba(212,175,55,0.06))', border:'1px solid rgba(34,197,94,0.15)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background:'radial-gradient(circle,#22C55E,transparent)' }}/>
        <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:'#22C55E' }}/>
              <span className="text-xs font-medium" style={{ color:'var(--text3)' }}>Student Portal</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black mb-1" style={{ color:'var(--text1)' }}>
              Hello, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>! 👋
            </h1>
            <p className="text-sm" style={{ color:'var(--text3)' }}>
              {user?.department} &nbsp;·&nbsp; Semester {user?.semester} &nbsp;·&nbsp; {user?.roll_no}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {pendingFees.length > 0 && (
                <button onClick={() => navigate('/student/fees')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background:'rgba(212,175,55,0.12)', color:'#B8960C', border:'1px solid rgba(212,175,55,0.28)' }}>
                  <CreditCard size={11}/> {pendingFees.length} fee pending
                </button>
              )}
              {pendingLeaves.length > 0 && (
                <button onClick={() => navigate('/student/leaves')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background:'rgba(34,197,94,0.12)', color:'#15803D', border:'1px solid rgba(34,197,94,0.25)' }}>
                  <Calendar size={11}/> {pendingLeaves.length} leave pending
                </button>
              )}
            </div>
          </div>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white shrink-0"
            style={{ background:'linear-gradient(135deg,#22C55E,#15803D)', boxShadow:'0 8px 24px rgba(34,197,94,0.30)' }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
        </div>
      </motion.div>

      {/* Quick links */}
      <motion.h2 {...f(1)} className="text-sm font-bold mb-4" style={{ color:'var(--text2)' }}>Quick Access</motion.h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
        {links.map(({ label, icon:Icon, to, color, bg, badge }, i) => (
          <motion.button key={i} {...f(i+2)} onClick={() => navigate(to)}
            className="card-flat p-4 text-left relative"
            whileHover={{ y:-3, boxShadow:`0 12px 32px rgba(0,0,0,0.15)` }}>
            {badge > 0 && (
              <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                style={{ background:'#22C55E' }}>{badge}</span>
            )}
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background:bg }}>
              <Icon size={17} style={{ color }}/>
            </div>
            <p className="text-xs font-semibold" style={{ color:'var(--text1)' }}>{label}</p>
          </motion.button>
        ))}
      </div>

      {/* Notices + Fees */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div {...f(10)} className="card-flat p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-sm" style={{ color:'var(--text1)' }}>Recent Notices</h2>
            <button onClick={() => navigate('/student/notices')}
              className="flex items-center gap-1 text-xs font-medium"
              style={{ color:'var(--text3)' }}
              onMouseEnter={e=>e.currentTarget.style.color='var(--p)'}
              onMouseLeave={e=>e.currentTarget.style.color='var(--text3)'}>
              View all <ArrowRight size={11}/>
            </button>
          </div>
          {notices.length === 0
            ? <p className="text-xs text-center py-8" style={{ color:'var(--text3)' }}>No notices</p>
            : <div className="space-y-2">
                {notices.slice(0,3).map((n,i) => (
                  <div key={i} className="p-3 rounded-xl transition-all"
                    style={{ background:'var(--bg4)', border:'1px solid var(--border2)' }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor='var(--border)'}
                    onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border2)'}>
                    <p className="text-xs font-semibold mb-1" style={{ color:'var(--text1)' }}>{n.title}</p>
                    <p className="text-[11px] line-clamp-2" style={{ color:'var(--text3)' }}>{n.description}</p>
                  </div>
                ))}
              </div>
          }
        </motion.div>

        <motion.div {...f(11)} className="card-flat p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-sm" style={{ color:'var(--text1)' }}>Fee Summary</h2>
            <button onClick={() => navigate('/student/fees')}
              className="flex items-center gap-1 text-xs font-medium"
              style={{ color:'var(--text3)' }}
              onMouseEnter={e=>e.currentTarget.style.color='var(--p)'}
              onMouseLeave={e=>e.currentTarget.style.color='var(--text3)'}>
              View all <ArrowRight size={11}/>
            </button>
          </div>
          {fees.length === 0
            ? <p className="text-xs text-center py-8" style={{ color:'var(--text3)' }}>No fee records</p>
            : <div className="space-y-2">
                {fees.map((fee,i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl transition-all"
                    style={{ background:'var(--bg4)', border:'1px solid var(--border2)' }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor='var(--border)'}
                    onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border2)'}>
                    <div>
                      <p className="text-xs font-semibold" style={{ color:'var(--text1)' }}>{fee.description}</p>
                      <p className="text-[11px] mt-0.5" style={{ color:'var(--text3)' }}>₹{Number(fee.amount).toLocaleString()}</p>
                    </div>
                    <span className={fee.status==='paid'?'badge-paid':'badge-pending'}>{fee.status}</span>
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

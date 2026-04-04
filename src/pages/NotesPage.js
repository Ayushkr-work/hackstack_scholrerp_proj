import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ClipboardList, Rocket, Clock, User, Loader2, Search, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const TABS = [
  { key:'all',        label:'All',         icon: BookOpen,      color:'#818CF8' },
  { key:'note',       label:'Notes',       icon: BookOpen,      color:'#818CF8' },
  { key:'assignment', label:'Assignments', icon: ClipboardList, color:'#F59E0B' },
  { key:'project',    label:'Projects',    icon: Rocket,        color:'#22C55E' },
];

const TYPE_META = {
  note:       { color:'#818CF8', bg:'rgba(129,140,248,0.12)', icon: BookOpen      },
  assignment: { color:'#F59E0B', bg:'rgba(245,158,11,0.12)',  icon: ClipboardList },
  project:    { color:'#22C55E', bg:'rgba(34,197,94,0.12)',   icon: Rocket        },
};

function daysLeft(deadline) {
  if (!deadline) return null;
  return Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
}

function DeadlineBadge({ deadline }) {
  if (!deadline) return null;
  const days = daysLeft(deadline);
  const date = new Date(deadline).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
  if (days < 0)  return <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background:'rgba(239,68,68,0.12)', color:'#EF4444' }}><AlertTriangle size={11}/>Overdue · {date}</span>;
  if (days === 0) return <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background:'rgba(239,68,68,0.12)', color:'#EF4444' }}><Clock size={11}/>Due Today!</span>;
  if (days <= 3)  return <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background:'rgba(245,158,11,0.12)', color:'#F59E0B' }}><Clock size={11}/>{days}d left · {date}</span>;
  return <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full" style={{ background:'rgba(34,197,94,0.10)', color:'#22C55E' }}><Clock size={11}/>{days}d left · {date}</span>;
}

function NoteCard({ n, i }) {
  const [expanded, setExpanded] = useState(false);
  const meta = TYPE_META[n.type] || TYPE_META.note;
  const Icon = meta.icon;

  return (
    <motion.div
      initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.04 }}
      className="rounded-2xl overflow-hidden"
      style={{ background:'var(--bg3)', border:'1px solid var(--border2)', boxShadow:'var(--shadow)' }}>

      {/* Color top bar */}
      <div style={{ height:'3px', background: meta.color, opacity:0.7 }}/>

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: meta.bg }}>
              <Icon size={18} style={{ color: meta.color }}/>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
                  style={{ background: meta.bg, color: meta.color }}>{n.type}</span>
                {n.subject && <span className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                  style={{ background:'var(--bg4)', color:'var(--text3)', border:'1px solid var(--border2)' }}>{n.subject}</span>}
                {n.semester && <span className="text-[11px]" style={{ color:'var(--text4)' }}>Sem {n.semester}</span>}
              </div>
              <h3 style={{ color:'var(--text1)', fontWeight:800, fontSize:'0.95rem', lineHeight:1.3 }}>{n.title}</h3>
            </div>
          </div>
        </div>

        {/* Content preview / expanded */}
        {n.content && (
          <div className="mb-3">
            <p className="text-sm leading-relaxed"
              style={{ color:'var(--text3)', whiteSpace:'pre-line',
                display: expanded ? 'block' : '-webkit-box',
                WebkitLineClamp: expanded ? 'unset' : 3,
                WebkitBoxOrient: 'vertical',
                overflow: expanded ? 'visible' : 'hidden',
              }}>
              {n.content}
            </p>
            {n.content.length > 180 && (
              <button onClick={() => setExpanded(p=>!p)}
                className="flex items-center gap-1 mt-2 text-xs font-semibold transition-colors"
                style={{ color:'var(--p)' }}>
                {expanded ? <><ChevronUp size={12}/>Show less</> : <><ChevronDown size={12}/>Read more</>}
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-3"
          style={{ borderTop:'1px solid var(--border2)' }}>
          <div className="flex items-center gap-1.5" style={{ color:'var(--text4)', fontSize:'0.75rem' }}>
            <User size={11}/>
            <span>{n.faculty_name}</span>
            <span style={{ color:'var(--border)' }}>·</span>
            <span>{new Date(n.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}</span>
          </div>
          <DeadlineBadge deadline={n.deadline}/>
        </div>
      </div>
    </motion.div>
  );
}

export default function StudyPage() {
  const { user } = useAuth();
  const [notes,   setNotes]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState('all');
  const [search,  setSearch]  = useState('');

  useEffect(() => {
    api.get('/faculty/notes')
      .then(d => setNotes(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = notes.filter(n => {
    const matchTab    = tab === 'all' || n.type === tab;
    const matchSearch = !search ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.subject?.toLowerCase().includes(search.toLowerCase()) ||
      n.faculty_name?.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  // Upcoming deadlines (assignments + projects with deadline, not overdue, sorted)
  const upcoming = notes
    .filter(n => n.deadline && (n.type === 'assignment' || n.type === 'project'))
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

  const counts = {
    all:        notes.length,
    note:       notes.filter(n=>n.type==='note').length,
    assignment: notes.filter(n=>n.type==='assignment').length,
    project:    notes.filter(n=>n.type==='project').length,
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ color:'var(--text1)', fontWeight:900, fontSize:'1.4rem' }}>Study</h1>
          <p style={{ color:'var(--text3)', fontSize:'0.8rem' }} className="mt-0.5">
            {counts.note} notes · {counts.assignment} assignments · {counts.project} projects
          </p>
          {user?.department && (
            <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background:'rgba(129,140,248,0.12)', color:'#818CF8', border:'1px solid rgba(129,140,248,0.20)' }}>
              <BookOpen size={11}/> {user.department} Department
            </span>
          )}
        </div>
      </div>

      {/* Upcoming deadlines strip */}
      {upcoming.length > 0 && (
        <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
          className="rounded-2xl p-4 mb-6 overflow-x-auto"
          style={{ background:'rgba(245,158,11,0.06)', border:'1px solid rgba(245,158,11,0.20)' }}>
          <p className="text-xs font-bold mb-3 flex items-center gap-1.5" style={{ color:'#F59E0B' }}>
            <Clock size={12}/> UPCOMING DEADLINES
          </p>
          <div className="flex gap-3" style={{ minWidth:'max-content' }}>
            {upcoming.map(n => {
              const days = daysLeft(n.deadline);
              const meta = TYPE_META[n.type];
              return (
                <div key={n.id} className="rounded-xl px-4 py-3 shrink-0"
                  style={{ background:'var(--bg3)', border:`1px solid ${days <= 3 ? 'rgba(239,68,68,0.25)' : 'var(--border2)'}`, minWidth:'200px' }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded"
                      style={{ background: meta.bg, color: meta.color }}>{n.type}</span>
                  </div>
                  <p className="text-xs font-semibold line-clamp-1 mb-1" style={{ color:'var(--text1)' }}>{n.title}</p>
                  <DeadlineBadge deadline={n.deadline}/>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Search */}
      <div className="relative mb-5">
        <Search size={14} style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'var(--text4)', pointerEvents:'none' }}/>
        <input className="input-dark input-icon-left" placeholder="Search notes, assignments, projects..."
          value={search} onChange={e => setSearch(e.target.value)}/>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {TABS.map(({ key, label, icon:Icon, color }) => (
          <button key={key} onClick={() => setTab(key)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all shrink-0"
            style={{
              background: tab === key ? color        : 'var(--bg3)',
              color:      tab === key ? '#fff'        : 'var(--text3)',
              border:     `1px solid ${tab === key ? color : 'var(--border2)'}`,
              boxShadow:  tab === key ? `0 4px 14px ${color}40` : 'none',
            }}>
            <Icon size={13}/>
            {label}
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
              style={{ background: tab === key ? 'rgba(255,255,255,0.25)' : 'var(--bg4)', color: tab === key ? '#fff' : 'var(--text4)' }}>
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3" style={{ color:'var(--text3)' }}>
          <Loader2 size={20} className="animate-spin" style={{ color:'var(--p)' }}/>
          <span style={{ fontSize:'0.875rem' }}>Loading study material...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20" style={{ color:'var(--text3)' }}>
          <BookOpen size={40} style={{ margin:'0 auto 12px', opacity:.3 }}/>
          <p style={{ fontSize:'0.875rem' }}>No {tab === 'all' ? 'content' : tab+'s'} found</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((n, i) => <NoteCard key={n.id} n={n} i={i}/>)}
          </motion.div>
        </AnimatePresence>
      )}
    </DashboardLayout>
  );
}

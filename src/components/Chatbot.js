import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

const FAQ = [
  { q:['result','marks','grade'],    a:'Go to Results in the navbar to view your semester-wise marks and grades.' },
  { q:['fee','payment','pay'],       a:'Visit Fees section to view pending dues and simulate payment.' },
  { q:['leave','absent','apply'],    a:'Use the Leave section to apply and track leave status.' },
  { q:['notice','announcement'],     a:'Check Notices for all college announcements.' },
  { q:['placement','job','company'], a:'Visit Placements to see openings and apply directly.' },
  { q:['profile','update'],          a:'Go to Profile to view and update your information.' },
  { q:['hello','hi','hey','help'],   a:"Hello! 👋 I'm your ScholrERP assistant. Ask about results, fees, leaves, placements or notices!" },
  { q:['demo','credentials'],        a:'Admin: admin@mit.edu / admin123 | Student: arjun@student.edu / student123' },
];
const reply = msg => { const l=msg.toLowerCase(); for(const{q,a}of FAQ)if(q.some(k=>l.includes(k)))return a; return "Try asking about results, fees, leaves, placements, or notices!"; };

export default function Chatbot() {
  const [open, setOpen]   = useState(false);
  const [msgs, setMsgs]   = useState([{ from:'bot', text:"Hi! 👋 I'm your ScholrERP AI assistant. How can I help?" }]);
  const [input, setInput] = useState('');
  const bottom = useRef(null);
  useEffect(() => { bottom.current?.scrollIntoView({ behavior:'smooth' }); }, [msgs]);

  const send = () => {
    if (!input.trim()) return;
    const text = input; setInput('');
    setMsgs(p => [...p, { from:'user', text }]);
    setTimeout(() => setMsgs(p => [...p, { from:'bot', text:reply(text) }]), 500);
  };

  return (
    <>
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-13 h-13 rounded-2xl flex items-center justify-center shadow-2xl"
        style={{ width:52, height:52, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow:'0 8px 24px rgba(99,102,241,0.45)' }}
        whileHover={{ scale:1.08, boxShadow:'0 12px 32px rgba(99,102,241,0.6)' }}
        whileTap={{ scale:.94 }}
        onClick={() => setOpen(p=>!p)}>
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="x"   initial={{rotate:-90,opacity:0}} animate={{rotate:0,opacity:1}} exit={{rotate:90,opacity:0}}><X size={20} color="#fff"/></motion.div>
            : <motion.div key="msg" initial={{rotate:90,opacity:0}}  animate={{rotate:0,opacity:1}} exit={{rotate:-90,opacity:0}}><MessageCircle size={20} color="#fff"/></motion.div>
          }
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-[72px] right-6 z-50 w-80 rounded-2xl overflow-hidden"
            style={{ background:'var(--bg3)', border:'1px solid var(--border)', boxShadow:'0 24px 60px rgba(0,0,0,0.6)' }}
            initial={{ opacity:0, scale:.88, y:16 }} animate={{ opacity:1, scale:1, y:0 }}
            exit={{ opacity:0, scale:.88, y:16 }} transition={{ type:'spring', damping:26, stiffness:320 }}>

            {/* Header */}
            <div className="p-4 flex items-center gap-3"
              style={{ background:'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.10))', borderBottom:'1px solid var(--border2)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background:'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                <Sparkles size={16} color="#fff"/>
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color:'var(--text1)' }}>ScholrERP Assistant</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:'#34d399' }}/>
                  <span className="text-[11px]" style={{ color:'var(--text3)' }}>Online</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-60 overflow-y-auto p-4 space-y-3">
              {msgs.map((m,i) => (
                <motion.div key={i} className={`flex ${m.from==='user'?'justify-end':'justify-start'}`}
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}>
                  <div className={`max-w-[82%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                    m.from==='user'
                      ? 'text-white'
                      : ''
                  }`} style={m.from==='user'
                    ? { background:'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow:'0 4px 12px rgba(99,102,241,0.3)' }
                    : { background:'var(--bg4)', border:'1px solid var(--border2)', color:'var(--text2)' }}>
                    {m.text}
                  </div>
                </motion.div>
              ))}
              <div ref={bottom}/>
            </div>

            {/* Input */}
            <div className="p-3 flex gap-2" style={{ borderTop:'1px solid var(--border2)' }}>
              <input
                className="flex-1 rounded-xl px-3 py-2 text-xs outline-none transition-all"
                style={{ background:'var(--bg4)', border:'1px solid var(--border2)', color:'var(--text1)' }}
                placeholder="Ask me anything..."
                value={input}
                onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&send()}
                onFocus={e=>e.target.style.borderColor='#6366f1'}
                onBlur={e=>e.target.style.borderColor='var(--border2)'}
              />
              <button onClick={send}
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all"
                style={{ background:'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
                onMouseEnter={e=>e.currentTarget.style.filter='brightness(1.1)'}
                onMouseLeave={e=>e.currentTarget.style.filter='none'}>
                <Send size={13} color="#fff"/>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

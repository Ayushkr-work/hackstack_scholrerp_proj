import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Wifi, WifiOff } from 'lucide-react';

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
const localReply = msg => {
  const l = msg.toLowerCase();
  for (const { q, a } of FAQ) if (q.some(k => l.includes(k))) return a;
  return "Try asking about results, fees, leaves, placements, or notices!";
};

const API_URL = 'http://localhost:5000/api/ai/chat';

export default function Chatbot() {
  const [open, setOpen]       = useState(false);
  const [msgs, setMsgs]       = useState([{ from:'bot', text:"Hi! 👋 I'm your ScholrERP AI assistant. How can I help?" }]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [aiOnline, setAiOnline] = useState(false);
  const bottom = useRef(null);
  const historyRef = useRef([]); // stores {role, content} pairs for context

  useEffect(() => { bottom.current?.scrollIntoView({ behavior:'smooth' }); }, [msgs]);

  // Check if backend AI is reachable on open
  useEffect(() => {
    if (!open) return;
    const token = localStorage.getItem('token');
    if (!token) { setAiOnline(false); return; }
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
      body: JSON.stringify({ message: 'ping', history: [] }),
    }).then(r => setAiOnline(r.ok)).catch(() => setAiOnline(false));
  }, [open]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput('');
    setMsgs(p => [...p, { from:'user', text }]);
    setLoading(true);

    const token = localStorage.getItem('token');

    // Try real AI backend first
    if (token) {
      try {
        const res = await fetch(API_URL, {
          method:  'POST',
          headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
          body:    JSON.stringify({ message: text, history: historyRef.current }),
        });
        if (res.ok) {
          const data = await res.json();
          const reply = data.reply || "I couldn't get a response. Please try again.";
          historyRef.current = [
            ...historyRef.current.slice(-10),
            { role:'user',      content: text  },
            { role:'assistant', content: reply },
          ];
          setMsgs(p => [...p, { from:'bot', text: reply }]);
          setAiOnline(true);
          setLoading(false);
          return;
        }
      } catch {}
    }

    // Fallback to local FAQ
    setAiOnline(false);
    setTimeout(() => {
      setMsgs(p => [...p, { from:'bot', text: localReply(text) }]);
      setLoading(false);
    }, 400);
  };

  return (
    <>
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-[52px] h-[52px] rounded-2xl flex items-center justify-center shadow-2xl"
        style={{ background:'linear-gradient(135deg,var(--p),var(--pd))', boxShadow:'0 8px 24px rgba(34,197,94,0.35)' }}
        whileHover={{ scale:1.08 }} whileTap={{ scale:.94 }}
        onClick={() => setOpen(p => !p)}>
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
            className="fixed bottom-[76px] right-6 z-50 w-80 rounded-2xl overflow-hidden"
            style={{ background:'var(--bg3)', border:'1px solid var(--border)', boxShadow:'0 24px 60px rgba(0,0,0,0.25)' }}
            initial={{ opacity:0, scale:.88, y:16 }} animate={{ opacity:1, scale:1, y:0 }}
            exit={{ opacity:0, scale:.88, y:16 }} transition={{ type:'spring', damping:26, stiffness:320 }}>

            {/* Header */}
            <div className="p-4 flex items-center gap-3"
              style={{ background:'linear-gradient(135deg,rgba(34,197,94,0.10),rgba(212,175,55,0.06))', borderBottom:'1px solid var(--border2)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background:'linear-gradient(135deg,var(--p),var(--pd))' }}>
                <Sparkles size={16} color="#fff"/>
              </div>
              <div className="flex-1">
                <p style={{ color:'var(--text1)', fontWeight:700, fontSize:'0.875rem' }}>ScholrERP Assistant</p>
                <div className="flex items-center gap-1.5">
                  {aiOnline
                    ? <><Wifi size={10} style={{ color:'var(--p)' }}/><span style={{ color:'var(--p)', fontSize:'0.68rem', fontWeight:500 }}>AI Online</span></>
                    : <><WifiOff size={10} style={{ color:'var(--text4)' }}/><span style={{ color:'var(--text4)', fontSize:'0.68rem' }}>Local Mode</span></>
                  }
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-3">
              {msgs.map((m, i) => (
                <motion.div key={i} className={`flex ${m.from==='user'?'justify-end':'justify-start'}`}
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}>
                  <div className="max-w-[82%] px-3 py-2 rounded-xl text-xs leading-relaxed"
                    style={m.from==='user'
                      ? { background:'linear-gradient(135deg,var(--p),var(--pd))', color:'#fff', boxShadow:'0 4px 12px rgba(34,197,94,0.25)' }
                      : { background:'var(--bg4)', border:'1px solid var(--border2)', color:'var(--text2)' }}>
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="px-3 py-2 rounded-xl" style={{ background:'var(--bg4)', border:'1px solid var(--border2)' }}>
                    <div className="flex gap-1">
                      {[0,1,2].map(i => (
                        <motion.div key={i} className="w-1.5 h-1.5 rounded-full"
                          style={{ background:'var(--text4)' }}
                          animate={{ y:[0,-4,0] }} transition={{ duration:.6, repeat:Infinity, delay:i*.15 }}/>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottom}/>
            </div>

            {/* Input */}
            <div className="p-3 flex gap-2" style={{ borderTop:'1px solid var(--border2)' }}>
              <input
                className="flex-1 rounded-xl px-3 py-2 text-xs outline-none transition-all"
                style={{ background:'var(--bg4)', border:'1px solid var(--border2)', color:'var(--text1)' }}
                placeholder="Ask me anything..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key==='Enter' && send()}
                onFocus={e  => e.target.style.borderColor='var(--p)'}
                onBlur={e   => e.target.style.borderColor='var(--border2)'}
                disabled={loading}
              />
              <button onClick={send} disabled={loading || !input.trim()}
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all disabled:opacity-40"
                style={{ background:'linear-gradient(135deg,var(--p),var(--pd))' }}>
                <Send size={13} color="#fff"/>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

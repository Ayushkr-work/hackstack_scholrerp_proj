import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Trash2, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api/ai/chat';

const SUGGESTIONS = {
  student: [
    'What are my results?',
    'Show my attendance',
    'Any pending fees?',
    'My timetable today',
    'Latest notices',
    'Placement openings',
  ],
  faculty: [
    'Show my timetable',
    'What did I post recently?',
    'Pending leaves in my dept',
    'How many students in my dept?',
  ],
  admin: [
    'College summary',
    'Pending leave requests',
    'Fee collection status',
    'Open helpdesk tickets',
    'Department breakdown',
  ],
};

// Simple markdown-ish renderer: bold, bullets, line breaks
function MsgText({ text }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-0.5">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1"/>;
        // bullet
        const isBullet = /^[-•*]\s/.test(line.trim());
        const content  = line.replace(/^[-•*]\s/, '').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        return (
          <div key={i} className={`flex gap-1.5 ${isBullet ? 'items-start' : ''}`}>
            {isBullet && <span className="mt-1 shrink-0" style={{ color:'var(--p)', fontSize:'0.5rem' }}>●</span>}
            <span dangerouslySetInnerHTML={{ __html: content }}/>
          </div>
        );
      })}
    </div>
  );
}

export default function Chatbot() {
  const { role } = useAuth();
  const [open, setOpen]       = useState(false);
  const [msgs, setMsgs]       = useState([{
    from: 'bot',
    text: `Hi! 👋 I'm your ScholrERP AI assistant.\nAsk me anything about your ${role === 'admin' ? 'college data' : role === 'faculty' ? 'timetable & students' : 'results, fees, attendance & more'}!`,
  }]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [showSugg, setShowSugg] = useState(true);
  const bottom   = useRef(null);
  const inputRef = useRef(null);
  const historyRef = useRef([]);

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, loading]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 200); }, [open]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    setShowSugg(false);
    setMsgs(p => [...p, { from: 'user', text: msg }]);
    setLoading(true);

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(API_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ message: msg, history: historyRef.current }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed');
      const reply = data.reply || "I couldn't get a response.";
      historyRef.current = [
        ...historyRef.current.slice(-10),
        { role: 'user',      content: msg   },
        { role: 'assistant', content: reply },
      ];
      setMsgs(p => [...p, { from: 'bot', text: reply }]);
    } catch (err) {
      setMsgs(p => [...p, { from: 'bot', text: `⚠ ${err.message}`, error: true }]);
    }
    setLoading(false);
  };

  const clearChat = () => {
    historyRef.current = [];
    setShowSugg(true);
    setMsgs([{ from: 'bot', text: `Chat cleared! How can I help you?` }]);
  };

  const suggestions = SUGGESTIONS[role] || SUGGESTIONS.student;

  return (
    <>
      {/* FAB */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl"
        style={{ background: 'linear-gradient(135deg,var(--p),var(--pd))', boxShadow: '0 8px 28px rgba(34,197,94,0.40)' }}
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
        onClick={() => setOpen(p => !p)}>
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="x"   initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X size={22} color="#fff"/></motion.div>
            : <motion.div key="msg" initial={{ rotate: 90, opacity: 0 }}  animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><MessageCircle size={22} color="#fff"/></motion.div>
          }
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-[88px] right-6 z-50 flex flex-col rounded-2xl overflow-hidden"
            style={{
              width: 'min(380px, calc(100vw - 3rem))',
              height: 'min(560px, calc(100vh - 120px))',
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              boxShadow: '0 28px 70px rgba(0,0,0,0.30)',
            }}
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}>

            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 shrink-0"
              style={{ background: 'linear-gradient(135deg,rgba(34,197,94,0.10),rgba(212,175,55,0.06))', borderBottom: '1px solid var(--border2)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg,var(--p),var(--pd))' }}>
                <Sparkles size={16} color="#fff"/>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm" style={{ color: 'var(--text1)' }}>ScholrERP AI</p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22C55E' }}/>
                  <span className="text-[10px]" style={{ color: 'var(--text3)' }}>Powered by Gemini</span>
                </div>
              </div>
              <button onClick={clearChat} title="Clear chat"
                className="p-1.5 rounded-lg transition-all"
                style={{ color: 'var(--text3)' }}
                onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}>
                <Trash2 size={14}/>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {msgs.map((m, i) => (
                <motion.div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'} gap-2`}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                  {m.from === 'bot' && (
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: 'linear-gradient(135deg,var(--p),var(--pd))' }}>
                      <Sparkles size={10} color="#fff"/>
                    </div>
                  )}
                  <div className="max-w-[82%] px-3 py-2.5 rounded-2xl text-xs leading-relaxed"
                    style={m.from === 'user'
                      ? { background: 'linear-gradient(135deg,var(--p),var(--pd))', color: '#fff', borderBottomRightRadius: 4 }
                      : m.error
                      ? { background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.20)', color: '#EF4444', borderBottomLeftRadius: 4 }
                      : { background: 'var(--bg4)', border: '1px solid var(--border2)', color: 'var(--text2)', borderBottomLeftRadius: 4 }
                    }>
                    {m.from === 'user' ? m.text : <MsgText text={m.text}/>}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex justify-start gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'linear-gradient(135deg,var(--p),var(--pd))' }}>
                    <Sparkles size={10} color="#fff"/>
                  </div>
                  <div className="px-3 py-2.5 rounded-2xl" style={{ background: 'var(--bg4)', border: '1px solid var(--border2)', borderBottomLeftRadius: 4 }}>
                    <div className="flex gap-1 items-center">
                      {[0,1,2].map(i => (
                        <motion.div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--p)' }}
                          animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}/>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottom}/>
            </div>

            {/* Suggestions */}
            <AnimatePresence>
              {showSugg && (
                <motion.div className="px-3 pb-2 shrink-0"
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <div className="flex items-center gap-1 mb-2">
                    <ChevronDown size={10} style={{ color: 'var(--text3)' }}/>
                    <span className="text-[10px]" style={{ color: 'var(--text3)' }}>Suggestions</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.map((s, i) => (
                      <button key={i} onClick={() => send(s)}
                        className="px-2.5 py-1 rounded-full text-[11px] font-medium transition-all"
                        style={{ background: 'var(--bg4)', color: 'var(--text2)', border: '1px solid var(--border2)' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--p)'; e.currentTarget.style.color = 'var(--p)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--text2)'; }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <div className="p-3 flex gap-2 shrink-0" style={{ borderTop: '1px solid var(--border2)' }}>
              <input
                ref={inputRef}
                className="flex-1 rounded-xl px-3 py-2 text-xs outline-none transition-all"
                style={{ background: 'var(--bg4)', border: '1px solid var(--border2)', color: 'var(--text1)' }}
                placeholder="Ask me anything..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                onFocus={e  => e.target.style.borderColor = 'var(--p)'}
                onBlur={e   => e.target.style.borderColor = 'var(--border2)'}
                disabled={loading}
              />
              <motion.button onClick={() => send()} disabled={loading || !input.trim()}
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg,var(--p),var(--pd))' }}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Send size={14} color="#fff"/>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

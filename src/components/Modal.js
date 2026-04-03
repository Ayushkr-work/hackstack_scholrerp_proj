import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  const sizes = { sm:'max-w-md', md:'max-w-lg', lg:'max-w-2xl', xl:'max-w-4xl' };
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
          <motion.div className="absolute inset-0 backdrop-blur-md"
            style={{ background:'rgba(0,0,0,0.6)' }} onClick={onClose}/>
          <motion.div
            className={`relative w-full ${sizes[size]} max-h-[90vh] overflow-y-auto rounded-2xl`}
            style={{ background:'var(--bg3)', border:'1px solid var(--border)', boxShadow:'0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1)' }}
            initial={{ scale:.92, opacity:0, y:20 }}
            animate={{ scale:1, opacity:1, y:0 }}
            exit={{ scale:.92, opacity:0, y:20 }}
            transition={{ type:'spring', damping:28, stiffness:340 }}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom:'1px solid var(--border2)' }}>
              <h2 className="text-base font-bold gradient-text">{title}</h2>
              <button onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                style={{ color:'var(--text3)', border:'1px solid var(--border2)' }}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(99,102,241,0.1)';e.currentTarget.style.color='var(--text1)';}}
                onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='var(--text3)';}}>
                <X size={15}/>
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

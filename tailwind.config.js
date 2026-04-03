/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary:   { DEFAULT:'#22C55E', light:'#4ADE80', dark:'#15803D', glow:'rgba(34,197,94,0.35)' },
        gold:      { DEFAULT:'#D4AF37', light:'#FACC15', dark:'#B8960C', glow:'rgba(212,175,55,0.35)' },
        ink:       { DEFAULT:'#0B1F14', 2:'#2F3E34', 3:'#6B7280', 4:'#9CA3AF' },
        surface:   { DEFAULT:'#F6F8F4', 2:'#EEF2EA', card:'rgba(255,255,255,0.85)' },
        dark: {
          bg:  '#020B05', bg2:'#051009', bg3:'#07130A',
          bg4: '#0D1F10', bg5:'#122916',
          text:'#ECFDF5',
        },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      boxShadow: {
        green: '0 4px 20px rgba(34,197,94,0.25)',
        gold:  '0 4px 20px rgba(212,175,55,0.25)',
        card:  '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
};

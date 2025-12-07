import React from 'react';
import { motion } from 'framer-motion';

interface MoodPaperProps {
  text: string;
  setText: (text: string) => void;
  disabled: boolean;
}

export const MoodPaper: React.FC<MoodPaperProps> = ({ text, setText, disabled }) => {
  return (
    <motion.div
      layoutId="mood-paper"
      className="relative w-72 h-72 md:w-80 md:h-80 shadow-xl transform rotate-1 flex flex-col p-6 rounded-sm"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, rotate: disabled ? 0 : 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      style={{
        background: `linear-gradient(135deg, #FEF9C3 0%, #FDE047 100%)`,
        boxShadow: '10px 10px 30px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02)'
      }}
    >
      {/* Washi Tape Effect */}
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-24 h-8 bg-pink-200/80 backdrop-blur-sm rotate-[-2deg] shadow-sm z-10 flex items-center justify-center overflow-hidden rounded-sm">
          <div className="w-full h-full opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+Cjwvc3ZnPg==')]"></div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        placeholder="把那些烦人的、不开心的事，都写在这里吧..."
        className={`
          flex-1 w-full h-full bg-transparent resize-none border-none outline-none 
          font-hand text-xl md:text-2xl text-slate-700 placeholder-slate-400/60
          leading-relaxed tracking-wide
          ${disabled ? 'cursor-default' : 'cursor-text'}
        `}
        spellCheck={false}
      />
      
      <div className="absolute bottom-4 right-4 opacity-40">
         {/* Simple doodle */}
         <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600">
           <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
           <path d="M16 11l2 2 4-4" strokeDasharray="4 2" strokeOpacity="0.5" />
         </svg>
      </div>
    </motion.div>
  );
};
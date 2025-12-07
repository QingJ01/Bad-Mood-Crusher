import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ToolType } from '../types';
import { Rocket } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface AnimationStageProps {
  tool: ToolType;
  moodText: string;
  onComplete: () => void;
}

export const AnimationStage: React.FC<AnimationStageProps> = ({ tool, moodText, onComplete }) => {
  
  useEffect(() => {
    // Play sound immediately when component mounts (animation starts)
    soundEngine.playToolSound(tool);

    // Allows animation to fully play out before showing result
    const timer = setTimeout(() => {
      onComplete();
    }, 4500); 
    return () => clearTimeout(timer);
  }, [tool, onComplete]);

  // --- ROCKET ANIMATION (发射) ---
  if (tool === ToolType.ROCKET) {
    return (
      <div className="relative w-full h-[600px] flex justify-center items-center overflow-hidden">
        <motion.div
          className="relative flex flex-col items-center z-10"
          initial={{ y: 0, scale: 1 }}
          animate={{ y: -1200, scale: 0.2, opacity: 0 }}
          transition={{ duration: 3, ease: [0.2, 0, 0.2, 1], delay: 0.5 }}
        >
          {/* The Paper folded */}
          <motion.div 
            className="w-16 h-16 bg-pastel-yellow shadow-inner flex items-center justify-center p-1 mb-[-10px] z-10"
            animate={{ rotate: [0, 5, -5, 0], borderRadius: ["2px", "50%"] }}
            transition={{ duration: 0.5 }}
          >
             <div className="w-full h-full border border-yellow-500/30 rounded-full bg-yellow-300/50"></div>
          </motion.div>
          
          {/* Rocket SVG */}
          <motion.div
             animate={{ y: [-2, 2, -2] }}
             transition={{ repeat: Infinity, duration: 0.2 }}
             className="text-red-500 relative z-20"
          >
            <Rocket size={80} fill="#f87171" className="transform -rotate-45 drop-shadow-lg" />
            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-blue-200 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2"></div>
          </motion.div>
          
          {/* Fire Trail */}
          <motion.div
            className="w-8 h-24 bg-gradient-to-t from-transparent via-orange-400 to-yellow-300 rounded-full blur-sm mt-[-20px] relative z-0"
            animate={{ height: [60, 100, 60], opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 0.15 }}
          />
          
           {/* Smoke Particles */}
           {[...Array(5)].map((_, i) => (
             <motion.div
               key={i}
               className="absolute bottom-[-40px] w-6 h-6 bg-white rounded-full opacity-60 blur-md"
               animate={{ y: 200, x: (i - 2) * 40, opacity: 0, scale: 2 }}
               transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
             />
           ))}
        </motion.div>
        
        {/* Stars */}
        {[...Array(20)].map((_, i) => (
             <motion.div
               key={i}
               className="absolute bg-yellow-200 rounded-full"
               style={{ 
                   left: `${Math.random() * 100}%`, 
                   top: `${Math.random() * 100}%`,
                   width: Math.random() * 4 + 2 + 'px',
                   height: Math.random() * 4 + 2 + 'px',
               }}
               animate={{ opacity: [0.2, 1, 0.2] }}
               transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
             />
        ))}
      </div>
    );
  }

  // --- SHREDDER ANIMATION (碎纸机) ---
  if (tool === ToolType.SHREDDER) {
    return (
      <div className="relative w-full h-[600px] flex flex-col items-center justify-center">
        {/* Machine Head */}
        <div className="relative z-20 bg-slate-100 w-72 h-20 rounded-t-2xl shadow-md flex items-center justify-center border-b-8 border-slate-200">
             <div className="w-56 h-3 bg-slate-800 rounded-full opacity-10"></div>
             <div className="absolute right-4 top-4 w-3 h-3 bg-green-400 rounded-full shadow-[0_0_10px_rgba(74,222,128,0.8)] animate-pulse"></div>
        </div>

        <div className="relative w-72 flex justify-center perspective-1000">
           {/* Paper feeding in */}
           <motion.div
             className="absolute -top-72 bg-pastel-yellow w-56 h-72 p-6 shadow-md overflow-hidden text-slate-400 text-sm font-hand"
             initial={{ y: -200 }}
             animate={{ y: 100 }} // Move deep into shredder
             transition={{ duration: 2, ease: "linear" }}
           >
              <div className="w-full h-full border-2 border-dashed border-yellow-300 p-2">
                 {moodText}
              </div>
           </motion.div>

           {/* Shredded Strips falling out */}
           <div className="absolute top-0 w-64 flex justify-between overflow-hidden h-[450px] px-2">
             {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-4 bg-pastel-yellow shadow-sm opacity-90 relative"
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ 
                    y: 500, 
                    opacity: [0, 1, 1, 0], 
                    rotateX: Math.random() * 720, 
                    rotateY: Math.random() * 360,
                    x: (Math.random() - 0.5) * 80 
                  }}
                  transition={{ 
                    duration: 2.5, 
                    delay: 2 + (Math.random() * 0.5), 
                    ease: "easeIn" 
                  }}
                >
                  {/* Stripes pattern on shred */}
                   <div className="w-full h-full bg-yellow-300/20"></div>
                </motion.div>
             ))}
           </div>
        </div>
         {/* Machine Body */}
         <div className="relative z-20 bg-slate-100 w-72 h-32 rounded-b-2xl shadow-xl flex items-center justify-center flex-col gap-2">
             <div className="text-slate-300 text-sm font-bold tracking-widest font-cute">MOOD SHREDDER 3000</div>
             <div className="flex gap-2">
                <div className="w-16 h-1 bg-slate-200 rounded"></div>
                <div className="w-16 h-1 bg-slate-200 rounded"></div>
             </div>
         </div>
      </div>
    );
  }

  // --- BUBBLE ANIMATION (泡泡) ---
  if (tool === ToolType.BUBBLE) {
    // Split text into chunks for bubbles
    const chunks = moodText.match(/.{1,4}/g) || ["..."]; 
    const bubbles = chunks.slice(0, 15);
    
    return (
      <div className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
        {/* Wand */}
        <motion.div 
            className="absolute bottom-[-20px] left-[10%] w-6 h-40 bg-pink-300 rounded-full origin-bottom z-10"
            initial={{ rotate: -45, y: 100 }}
            animate={{ rotate: [-45, -20, -45], y: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
        >
            <div className="absolute -top-10 -left-6 w-16 h-16 border-4 border-pink-300 rounded-full"></div>
        </motion.div>

        {bubbles.map((chunk, i) => (
            <motion.div
                key={i}
                className="absolute flex items-center justify-center bg-gradient-to-tr from-blue-100/40 to-pink-100/40 backdrop-blur-sm border border-white/60 rounded-full shadow-sm text-slate-500 text-xs px-2 text-center break-all leading-tight font-hand"
                style={{
                    width: Math.max(50, chunk.length * 15),
                    height: Math.max(50, chunk.length * 15),
                    left: '50%',
                    top: '60%'
                }}
                initial={{ 
                    x: 0, 
                    y: 0, 
                    scale: 0,
                    opacity: 0 
                }}
                animate={{ 
                    x: (Math.random() - 0.5) * 400, 
                    y: -500 - (Math.random() * 200), 
                    scale: 1 + Math.random() * 0.5,
                    opacity: [0, 1, 1, 0] 
                }}
                transition={{ 
                    duration: 4 + Math.random() * 2, 
                    delay: 0.5 + i * 0.3,
                    ease: "easeOut" 
                }}
            >
                {/* Bubble reflection */}
                <div className="absolute top-[15%] left-[15%] w-[20%] h-[20%] bg-white rounded-full opacity-80 blur-[1px]"></div>
                <div className="absolute bottom-[15%] right-[15%] w-[10%] h-[10%] bg-white rounded-full opacity-60 blur-[1px]"></div>
                <span className="opacity-70">{chunk}</span>
            </motion.div>
        ))}
      </div>
    );
  }

  // --- BLACK HOLE ANIMATION (黑洞) ---
  if (tool === ToolType.BLACK_HOLE) {
      return (
          <div className="relative w-full h-[600px] flex items-center justify-center">
              {/* The Void */}
              <motion.div
                 className="absolute rounded-full flex items-center justify-center z-10 bg-slate-900"
                 initial={{ width: 0, height: 0, opacity: 0 }}
                 animate={{ 
                    width: [0, 250, 250, 0], 
                    height: [0, 250, 250, 0],
                    opacity: [0, 1, 1, 0]
                 }}
                 transition={{ duration: 3.5, times: [0, 0.2, 0.8, 1] }}
              >
                 <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-[spin_3s_linear_infinite]"></div>
                 <div className="absolute inset-2 rounded-full border-4 border-purple-500/20 animate-[spin_2s_linear_infinite_reverse]"></div>
                 <div className="w-full h-full rounded-full shadow-[inset_0_0_50px_rgba(0,0,0,1)] bg-[radial-gradient(circle_at_center,_#312e81_0%,_#000_70%)]"></div>
              </motion.div>

              {/* The Paper getting sucked in */}
              <motion.div
                  className="relative bg-pastel-yellow w-64 h-64 flex items-center justify-center p-6 shadow-xl"
                  initial={{ scale: 1, rotate: 1, opacity: 1, x: 0, y: 0 }}
                  animate={{ 
                      scale: [1, 0.8, 0], 
                      rotate: [1, 10, 720], 
                      opacity: [1, 0.8, 0],
                      filter: ["blur(0px)", "blur(2px)", "blur(10px)"]
                  }}
                  transition={{ duration: 1.5, delay: 0.8, ease: "circIn" }}
              >
                  <p className="text-sm text-slate-400 font-hand line-through opacity-50">{moodText}</p>
              </motion.div>
          </div>
      )
  }

  return null;
};
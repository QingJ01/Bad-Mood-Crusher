import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoodPaper } from './components/MoodPaper';
import { ToolBar } from './components/ToolBar';
import { AnimationStage } from './components/AnimationStage';
import { HistoryModal } from './components/HistoryModal';
import { AppState, ToolType, HistoryItem } from './types';
import { getComfortingMessage } from './services/geminiService';
import { RefreshCcw, Heart, History, Volume2, VolumeX } from 'lucide-react';
import { soundEngine } from './utils/soundEngine';

// Mascot Component (治愈团子)
const Mascot = ({ state }: { state: AppState }) => {
  return (
    <motion.div 
      className="w-24 h-24 mb-4 relative"
      animate={state === AppState.PROCESSING ? { y: [0, -10, 0] } : { y: 0 }}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        {/* Body */}
        <circle cx="50" cy="55" r="40" fill="#FCE7F3" />
        
        {/* Face Expressions */}
        {state === AppState.IDLE && (
          <g>
            {/* Eyes */}
            <circle cx="35" cy="50" r="4" fill="#4B5563" />
            <circle cx="65" cy="50" r="4" fill="#4B5563" />
            {/* Mouth */}
            <path d="M 45 60 Q 50 65 55 60" stroke="#4B5563" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Cheeks */}
            <circle cx="30" cy="58" r="3" fill="#F472B6" opacity="0.6" />
            <circle cx="70" cy="58" r="3" fill="#F472B6" opacity="0.6" />
          </g>
        )}
        
        {state === AppState.PROCESSING && (
          <g>
            {/* Eyes (Closed happy) */}
            <path d="M 32 50 Q 36 46 40 50" stroke="#4B5563" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 60 50 Q 64 46 68 50" stroke="#4B5563" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Mouth (Open O) */}
            <circle cx="50" cy="62" r="3" fill="#4B5563" />
            {/* Arms up */}
            <path d="M 15 55 Q 5 45 15 35" stroke="#FCE7F3" strokeWidth="8" strokeLinecap="round" />
            <path d="M 85 55 Q 95 45 85 35" stroke="#FCE7F3" strokeWidth="8" strokeLinecap="round" />
          </g>
        )}

        {state === AppState.SHOW_RESULT && (
          <g>
            {/* Eyes (Happy arcs) */}
             <path d="M 32 52 Q 36 45 40 52" stroke="#4B5563" strokeWidth="3" fill="none" strokeLinecap="round" />
             <path d="M 60 52 Q 64 45 68 52" stroke="#4B5563" strokeWidth="3" fill="none" strokeLinecap="round" />
             {/* Mouth (Smile) */}
             <path d="M 42 60 Q 50 68 58 60" stroke="#4B5563" strokeWidth="3" fill="none" strokeLinecap="round" />
             <path d="M 50 30 L 55 20 L 60 28" fill="#FCD34D" /> {/* Little spark */}
             <circle cx="30" cy="58" r="4" fill="#F472B6" opacity="0.8" />
             <circle cx="70" cy="58" r="4" fill="#F472B6" opacity="0.8" />
          </g>
        )}
      </svg>
    </motion.div>
  );
};

export default function App() {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [moodText, setMoodText] = useState('');
  const [selectedTool, setSelectedTool] = useState<ToolType | null>(null);
  const [comfortMessage, setComfortMessage] = useState('');
  
  // History state
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Audio state
  const [isMuted, setIsMuted] = useState(false);

  // Initialize history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('crushHistory');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []);

  const addToHistory = (text: string, tool: ToolType, msg: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      moodText: text,
      toolType: tool,
      comfortMessage: msg
    };
    const newHistory = [newItem, ...history];
    setHistory(newHistory);
    localStorage.setItem('crushHistory', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('crushHistory');
  };

  const handleToolSelect = async (tool: ToolType) => {
    // Init audio on user gesture
    soundEngine.init();
    
    setSelectedTool(tool);
    setState(AppState.PROCESSING);
    
    const msg = await getComfortingMessage(moodText);
    setComfortMessage(msg);
    // Note: We add to history after animation completes to ensure flow feels right
  };

  const handleAnimationComplete = () => {
    setState(AppState.SHOW_RESULT);
    soundEngine.playHealSound();
    if (selectedTool && moodText) {
       addToHistory(moodText, selectedTool, comfortMessage);
    }
  };

  const handleReset = () => {
    setMoodText('');
    setComfortMessage('');
    setSelectedTool(null);
    setState(AppState.IDLE);
  };

  const toggleMute = () => {
    const newVal = !isMuted;
    setIsMuted(newVal);
    soundEngine.toggleMute(newVal);
  };

  return (
    <div className="min-h-screen bg-cream text-soft-text overflow-hidden font-sans relative">
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
         <div className="absolute top-[-5%] left-[-5%] w-80 h-80 bg-pastel-pink/40 rounded-full blur-3xl animate-float delay-1000"></div>
         <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-pastel-blue/40 rounded-full blur-3xl animate-float"></div>
         <div className="absolute top-[40%] right-[15%] w-40 h-40 bg-pastel-yellow/50 rounded-full blur-2xl animate-breathe"></div>
      </div>

      {/* Header */}
      <header className="absolute top-0 w-full p-6 flex justify-between items-center z-30 pointer-events-none">
         <div className="flex items-center gap-2 pointer-events-auto">
           <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm border border-slate-50">🍬</div>
           <h1 className="font-cute text-2xl tracking-wide text-slate-600">坏情绪粉碎机</h1>
         </div>
         
         <div className="flex gap-3 pointer-events-auto">
           <button 
             onClick={toggleMute}
             className="w-10 h-10 bg-white/60 backdrop-blur-md rounded-full flex items-center justify-center text-slate-500 hover:bg-white transition-colors shadow-sm"
             aria-label={isMuted ? "开启声音" : "静音"}
           >
             {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
           </button>
           <button 
             onClick={() => setShowHistory(true)}
             className="px-4 h-10 bg-white/60 backdrop-blur-md rounded-full flex items-center gap-2 text-slate-600 hover:bg-white transition-colors shadow-sm font-cute text-sm"
           >
             <History size={18} />
             <span className="hidden md:inline">治愈旅程</span>
           </button>
         </div>
      </header>

      {/* History Modal */}
      <HistoryModal 
        isOpen={showHistory} 
        onClose={() => setShowHistory(false)} 
        history={history}
        onClear={clearHistory}
      />

      {/* Main Stage */}
      <main className="flex flex-col items-center justify-center min-h-screen p-4 relative w-full max-w-4xl mx-auto z-10">
        
        <Mascot state={state} />

        <AnimatePresence mode='wait'>
          
          {/* IDLE STATE: Input */}
          {state === AppState.IDLE && (
            <motion.div
              key="input-stage"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
              className="flex flex-col items-center w-full"
            >
              <div className="mb-8 text-center max-w-md">
                 <h2 className="text-xl md:text-2xl font-bold mb-2 text-slate-700 font-cute">有什么不开心的事吗？</h2>
                 <p className="text-slate-500 text-sm md:text-base">写下来，我们一起把它消灭掉。</p>
              </div>

              <MoodPaper 
                text={moodText} 
                setText={setMoodText} 
                disabled={false} 
              />
              
              <ToolBar 
                onSelect={handleToolSelect} 
                disabled={false} 
                hasText={moodText.trim().length > 0} 
              />
            </motion.div>
          )}

          {/* PROCESSING STATE: Animation */}
          {state === AppState.PROCESSING && selectedTool && (
            <motion.div
              key="processing-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center justify-center"
            >
              <h3 className="text-xl font-cute text-slate-500 mb-8 animate-pulse">
                {selectedTool === ToolType.ROCKET && "正在装填火箭燃料..."}
                {selectedTool === ToolType.SHREDDER && "强力粉碎中..."}
                {selectedTool === ToolType.BUBBLE && "变身魔法泡泡..."}
                {selectedTool === ToolType.BLACK_HOLE && "正在打开虫洞..."}
              </h3>

              <AnimationStage 
                tool={selectedTool} 
                moodText={moodText} 
                onComplete={handleAnimationComplete} 
              />
            </motion.div>
          )}

          {/* RESULT STATE: Comfort Message */}
          {state === AppState.SHOW_RESULT && (
            <motion.div
               key="result-stage"
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="flex flex-col items-center justify-center max-w-md text-center px-6"
            >
               <motion.div 
                 initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
                 className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-md border-4 border-pastel-green"
               >
                 <Heart className="text-pastel-green fill-pastel-green" size={48} />
               </motion.div>
               
               <h3 className="text-2xl font-cute text-slate-700 mb-6">全都消失啦！</h3>
               
               <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white relative mb-10 w-full transform hover:scale-105 transition-transform duration-500">
                  <div className="absolute -top-4 -left-2 text-6xl text-pastel-pink opacity-40 font-serif">“</div>
                  <p className="text-xl font-hand text-slate-600 leading-loose tracking-wide">
                    {comfortMessage || "正在接收来自宇宙的信号..."}
                  </p>
                  <div className="absolute -bottom-8 -right-2 text-6xl text-pastel-pink opacity-40 font-serif rotate-180">“</div>
               </div>

               <button
                 onClick={handleReset}
                 className="group flex items-center gap-3 px-8 py-4 bg-slate-800 text-white rounded-full font-bold shadow-lg hover:bg-slate-700 hover:shadow-xl transition-all"
               >
                 <RefreshCcw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                 <span>心情好点了吗？再试一次</span>
               </button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
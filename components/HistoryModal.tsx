import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HistoryItem, ToolType } from '../types';
import { X, Rocket, Scissors, Wind, CircleDashed, Calendar } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onClear: () => void;
}

const getToolIcon = (type: ToolType) => {
  switch (type) {
    case ToolType.ROCKET: return <Rocket size={16} />;
    case ToolType.SHREDDER: return <Scissors size={16} />;
    case ToolType.BUBBLE: return <Wind size={16} />;
    case ToolType.BLACK_HOLE: return <CircleDashed size={16} />;
  }
};

const getToolColor = (type: ToolType) => {
    switch (type) {
      case ToolType.ROCKET: return 'bg-red-100 text-red-500';
      case ToolType.SHREDDER: return 'bg-blue-100 text-blue-500';
      case ToolType.BUBBLE: return 'bg-purple-100 text-purple-500';
      case ToolType.BLACK_HOLE: return 'bg-slate-200 text-slate-700';
    }
  };

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history, onClear }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-0 md:inset-10 flex items-center justify-center z-50 pointer-events-none"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="bg-cream w-full max-w-lg h-full md:h-auto md:max-h-[80vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden pointer-events-auto border-4 border-white">
              
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white/50">
                <h2 className="text-xl font-cute text-slate-700">📜 治愈旅程</h2>
                <div className="flex gap-2">
                    {history.length > 0 && (
                         <button 
                            onClick={onClear}
                            className="text-xs text-red-400 hover:text-red-600 underline mr-4"
                        >
                            清空记录
                        </button>
                    )}
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                {history.length === 0 ? (
                  <div className="h-40 flex flex-col items-center justify-center text-slate-400">
                    <p className="font-cute text-lg">还没有记录哦</p>
                    <p className="text-xs mt-2">快去粉碎你的第一个坏情绪吧！</p>
                  </div>
                ) : (
                  history.map((item) => (
                    <div key={item.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gray-50 to-transparent pointer-events-none"></div>
                      
                      {/* Top Row: Date & Tool */}
                      <div className="flex justify-between items-start mb-3">
                         <div className={`flex items-center gap-2 px-2 py-1 rounded-lg text-xs font-bold ${getToolColor(item.toolType)}`}>
                            {getToolIcon(item.toolType)}
                            <span>已粉碎</span>
                         </div>
                         <div className="flex items-center text-xs text-slate-300 font-mono">
                            <Calendar size={12} className="mr-1" />
                            {new Date(item.timestamp).toLocaleDateString()}
                         </div>
                      </div>

                      {/* Comfort Message */}
                      <p className="text-slate-600 font-hand text-lg mb-4 leading-relaxed">
                        {item.comfortMessage}
                      </p>

                      {/* Crushed Mood (Strikethrough) */}
                      <div className="pt-3 border-t border-dashed border-gray-100">
                         <p className="text-xs text-slate-400 line-through truncate opacity-60 group-hover:opacity-100 transition-opacity">
                           {item.moodText}
                         </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
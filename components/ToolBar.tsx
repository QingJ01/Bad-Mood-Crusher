import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Scissors, Wind, CircleDashed } from 'lucide-react';
import { ToolType } from '../types';

interface ToolBarProps {
  onSelect: (tool: ToolType) => void;
  disabled: boolean;
  hasText: boolean;
}

const tools = [
  {
    id: ToolType.SHREDDER,
    icon: Scissors,
    label: '强力粉碎',
    color: 'bg-blue-100 text-blue-500 hover:bg-blue-200',
    desc: '咔嚓咔嚓碎掉',
    delay: 0
  },
  {
    id: ToolType.ROCKET,
    icon: Rocket,
    label: '发射太空',
    color: 'bg-red-100 text-red-500 hover:bg-red-200',
    desc: '再也见不到了',
    delay: 0.1
  },
  {
    id: ToolType.BUBBLE,
    icon: Wind,
    label: '吹成泡泡',
    color: 'bg-purple-100 text-purple-500 hover:bg-purple-200',
    desc: '噗噗随风飘走',
    delay: 0.2
  },
  {
    id: ToolType.BLACK_HOLE,
    icon: CircleDashed,
    label: '丢进黑洞',
    color: 'bg-slate-800 text-slate-200 hover:bg-slate-700',
    desc: '吸入异次元',
    delay: 0.3
  }
];

export const ToolBar: React.FC<ToolBarProps> = ({ onSelect, disabled, hasText }) => {
  return (
    <div className="flex flex-col items-center gap-6 mt-10 w-full max-w-2xl px-4">
      {!disabled && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-soft-text font-cute text-lg mb-2 h-6 flex items-center gap-2"
        >
          {hasText ? "👇 选择一种方式消灭它：" : " "}
        </motion.p>
      )}

      <div className="flex justify-center gap-6 md:gap-8 flex-wrap">
        {tools.map((tool) => (
          <motion.button
            key={tool.id}
            onClick={() => onSelect(tool.id)}
            disabled={disabled || !hasText}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: tool.delay }}
            whileHover={!disabled && hasText ? { scale: 1.1, y: -5 } : {}}
            whileTap={!disabled && hasText ? { scale: 0.9 } : {}}
            className={`
              relative group flex flex-col items-center justify-center
              w-20 h-20 md:w-24 md:h-24 rounded-3xl transition-all duration-300
              ${tool.color}
              ${(!hasText || disabled) ? 'opacity-40 cursor-not-allowed scale-95' : 'shadow-lg cursor-pointer hover:shadow-xl'}
            `}
            aria-label={tool.label}
          >
            <tool.icon size={32} strokeWidth={2.5} className="md:mb-2" />
            <span className="hidden md:block text-xs md:text-sm font-bold font-cute">{tool.label}</span>

            {/* Tooltip Bubble */}
            {!disabled && hasText && (
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white text-soft-text text-xs py-2 px-3 rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none border border-gray-100">
                {tool.desc}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-r border-b border-gray-100"></div>
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

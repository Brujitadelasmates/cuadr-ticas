
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coef } from '../types';

export const Slot: React.FC<{
  id: string;
  label: string;
  color: string;
  filled: boolean;
  children?: React.ReactNode;
}> = ({ id, label, color, filled, children }) => {
  return (
    <motion.span
      id={id}
      initial={false}
      animate={{
        scale: filled ? [1, 1.2, 1.1] : 1,
        backgroundColor: filled ? "#ffffff" : "rgba(241, 245, 249, 0.5)",
        borderColor: filled ? color : "#e2e8f0",
        boxShadow: filled ? `0 0 15px ${color}33` : "none",
      }}
      className={`relative inline-flex min-w-[3rem] h-10 justify-center items-center rounded-xl border-2 px-2 align-middle font-black transition-colors duration-500 math-font ${
        filled ? "z-10" : "text-slate-300 border-dashed"
      }`}
      style={{ color: filled ? color : undefined }}
      title={label}
    >
      <AnimatePresence>
        {filled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 2] }}
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{ backgroundColor: color }}
          />
        )}
      </AnimatePresence>
      {children}
    </motion.span>
  );
};

export const CoefChip: React.FC<{ coef: Coef }> = ({ coef }) => {
  return (
    <div 
      className="flex items-center gap-2 px-4 py-2 rounded-2xl border-2 bg-white shadow-sm transition-transform hover:scale-105"
      style={{ borderColor: coef.color }}
    >
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: coef.color }} />
      <span className="font-bold text-slate-700 math-font">
        {coef.key} = {coef.label}
      </span>
    </div>
  );
};

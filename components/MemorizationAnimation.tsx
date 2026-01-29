
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COLORS, ICONS } from "../constants";

type Coeffs = { a: string; b: string; c: string };

const PHASE_DATA: Record<number, Coeffs> = {
  1: { a: "a", b: "b", c: "c" },
  2: { a: "1", b: "-3", c: "-2" },
};

export const MemorizationAnimation: React.FC = () => {
  const [phase, setPhase] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);

  const coeffs = PHASE_DATA[phase];

  const startAnimation = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setVisibleCount(0);

    const totalSteps = 8;
    const stepDelay = 1800; 

    for (let i = 1; i <= totalSteps; i++) {
      await new Promise((r) => setTimeout(r, stepDelay));
      setVisibleCount(i);
      
      if (i === 3) await new Promise((r) => setTimeout(r, 2000));
    }

    await new Promise((r) => setTimeout(r, 4000));

    if (phase === 1) {
      setVisibleCount(0);
      setPhase(2);
      await new Promise((r) => setTimeout(r, 1200));
      startAnimation(); 
    } else {
      setIsRunning(false);
    }
  };

  const reset = () => {
    setPhase(1);
    setIsRunning(false);
    setVisibleCount(0);
  };

  const formatVal = (val: string, forceParens: boolean = false) => {
    const isNumericNegative = !isNaN(parseFloat(val)) && parseFloat(val) < 0;
    if (forceParens || isNumericNegative) return `(${val})`;
    return val;
  };

  const CoeffSlot = ({ 
    val, 
    color, 
    index,
    forceParens = false,
    label = ""
  }: { 
    val: string; 
    color: string; 
    index: number;
    forceParens?: boolean;
    label?: string;
  }) => (
    <div className="relative inline-flex items-center justify-center min-w-[1.2em]">
      <AnimatePresence>
        {visibleCount < index && (
          <motion.span
            key="placeholder"
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="text-white/20 font-mono italic text-xl md:text-2xl"
          >
            {label || "?"}
          </motion.span>
        )}
      </AnimatePresence>
      <motion.span
        initial={{ opacity: 0, y: -60, scale: 2, filter: "blur(15px)", rotate: -15 }}
        animate={{ 
          opacity: visibleCount >= index ? 1 : 0, 
          y: visibleCount >= index ? 0 : -60,
          scale: visibleCount >= index ? 1 : 2,
          filter: visibleCount >= index ? "blur(0px)" : "blur(15px)",
          rotate: visibleCount >= index ? 0 : -15
        }}
        transition={{ 
          type: "spring",
          stiffness: 70,
          damping: 22,
          mass: 2
        }}
        className="font-black drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
        style={{ color }}
      >
        {visibleCount >= index ? formatVal(val, forceParens) : ""}
      </motion.span>
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center gap-10 py-4">
      {/* Navigation Controls */}
      <div className="flex flex-wrap justify-center gap-4">
        <button 
          onClick={() => { setPhase(1); setVisibleCount(0); setIsRunning(false); }}
          className={`px-6 py-2 rounded-xl font-bold transition-all duration-300 border-2 ${phase === 1 ? 'bg-blue-600 border-blue-400 text-white scale-105 shadow-lg shadow-blue-500/20' : 'bg-white border-slate-200 text-slate-400 hover:border-blue-200'}`}
        >
          Etapa 1: Genérica
        </button>
        <button 
          onClick={() => { setPhase(2); setVisibleCount(0); setIsRunning(false); }}
          className={`px-6 py-2 rounded-xl font-bold transition-all duration-300 border-2 ${phase === 2 ? 'bg-indigo-600 border-indigo-400 text-white scale-105 shadow-lg shadow-indigo-500/20' : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-200'}`}
        >
          Etapa 2: Numérica
        </button>
      </div>

      {/* Main Animation Container */}
      <div className="w-full max-w-4xl bg-[#0f172a] rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white/10 text-white overflow-hidden text-left relative mx-auto transition-all duration-700">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.05),transparent)] pointer-events-none" />
        
        {/* Equation Display - Shifted left using justify-start */}
        <div className="w-full text-xl md:text-2xl mb-12 flex justify-start items-center gap-3 flex-wrap font-mono font-bold tracking-tighter px-0">
          <CoeffSlot val={coeffs.a} color={COLORS.a} index={1} label="a" />
          <span className="text-white">x²</span>
          <span className="text-white font-light">+</span>
          <CoeffSlot val={coeffs.b} color={COLORS.b} index={2} label="b" />
          <span className="text-white">x</span>
          <span className="text-white font-light">+</span>
          <CoeffSlot val={coeffs.c} color={COLORS.c} index={3} label="c" />
          <span className="text-white"> = 0</span>
        </div>

        {/* Formula Display Block - Shifted left using ml-0 */}
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-3xl p-8 md:p-10 inline-block ml-0 border border-white/5">
          <div className="flex items-center gap-4 justify-start flex-wrap">
            <span className="text-2xl md:text-3xl font-light italic text-white">x</span>
            <span className="text-xl text-white font-thin">=</span>
            
            <div className="flex flex-col items-center">
              {/* Numerator */}
              <div className="border-b-2 border-white pb-3 px-6 flex items-center gap-3 whitespace-nowrap text-xl md:text-2xl font-mono font-bold tracking-tighter">
                <div className="flex items-center">
                  <span className="mr-1 text-white font-light">-</span>
                  <CoeffSlot val={coeffs.b} color={COLORS.b} index={4} forceParens label="b" />
                </div>
                
                <span className="text-white text-2xl">±</span>
                
                <div className="relative flex items-center">
                  <span className="text-4xl md:text-5xl font-thin -mt-2 text-white">√</span>
                  <div className="border-t-2 border-white pt-2 px-3 flex items-center gap-2">
                    <CoeffSlot val={coeffs.b} color={COLORS.b} index={5} forceParens label="b" />
                    <span className="text-sm md:text-base -mt-4 text-white font-black">²</span>
                    <span className="mx-1 text-white font-thin">-</span>
                    <span className="text-white italic font-medium">4</span>
                    <CoeffSlot val={coeffs.a} color={COLORS.a} index={6} forceParens label="a" />
                    <CoeffSlot val={coeffs.c} color={COLORS.c} index={7} forceParens label="c" />
                  </div>
                </div>
              </div>

              {/* Denominator */}
              <div className="pt-3 flex items-center gap-2 text-xl md:text-2xl font-mono font-bold tracking-tighter">
                <span className="italic text-white font-light">2</span>
                <CoeffSlot val={coeffs.a} color={COLORS.a} index={8} forceParens label="a" />
              </div>
            </div>
          </div>
        </div>

        {/* Visualization Progress Nodes - Keep centered for visual balance in the container */}
        <div className="mt-12 flex justify-center gap-3">
          {[1,2,3,4,5,6,7,8].map(i => (
            <motion.div 
              key={i} 
              animate={{
                scale: visibleCount >= i ? 1.3 : 1,
                opacity: visibleCount >= i ? 1 : 0.2,
                backgroundColor: visibleCount >= i ? "#60a5fa" : "#ffffff"
              }}
              className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.3)]" 
            />
          ))}
        </div>
      </div>

      {/* Primary Interaction Area */}
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={startAnimation}
          disabled={isRunning}
          className="group relative flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-95 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <ICONS.Play /> {isRunning ? 'Colocando...' : 'Ver Sustitución'}
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-3 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-95 border border-white/5"
        >
          <ICONS.Refresh /> Reiniciar
        </button>
      </div>

      {/* Educational Context Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm group">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-black mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all text-xs">01</div>
          <h4 className="font-bold text-slate-900 text-sm mb-2 uppercase tracking-tight">Signos</h4>
          <p className="text-slate-500 text-sm leading-snug">Valores negativos siempre entre <span className="text-blue-600 font-bold">paréntesis</span> para evitar errores de signo.</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm group">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all text-xs">02</div>
          <h4 className="font-bold text-slate-900 text-sm mb-2 uppercase tracking-tight">Potencia</h4>
          <p className="text-slate-500 text-sm leading-snug">Elevar negativos requiere paréntesis: <span className="font-mono bg-indigo-50 text-indigo-700 px-1 rounded">(-3)²</span> es fundamental.</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm group">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 font-black mb-4 group-hover:bg-purple-600 group-hover:text-white transition-all text-xs">03</div>
          <h4 className="font-bold text-slate-900 text-sm mb-2 uppercase tracking-tight">Presencia</h4>
          <p className="text-slate-500 text-sm leading-snug">Mantenemos el valor de <span className="text-purple-600 font-bold">a</span> visible incluso si es 1 para fijar la estructura visual.</p>
        </div>
      </div>
    </div>
  );
};

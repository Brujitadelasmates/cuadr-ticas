
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CoefKey, Coef, Solution, AnimationPhase } from './types';
import { COLORS, ICONS } from './constants';
import { explainQuadratic, generateChallenge, askTutor } from './services/geminiService';
import { Graph } from './components/Graph';
import { MemorizationAnimation } from './components/MemorizationAnimation';

export default function App() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-3);
  const [c, setC] = useState(-2);
  
  const [activeView, setActiveView] = useState<'solver' | 'trainer'>('solver');
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [userQuery, setUserQuery] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);

  const solution = useMemo<Solution>(() => {
    const disc = b * b - 4 * a * c;
    const denom = 2 * a;
    
    let x1: string | number, x2: string | number, type: 'real' | 'complex' | 'single';

    if (disc < 0) {
      const re = (-b / denom).toFixed(2);
      const im = (Math.sqrt(-disc) / denom).toFixed(2);
      x1 = `${re} + ${im}i`;
      x2 = `${re} - ${im}i`;
      type = 'complex';
    } else if (disc === 0) {
      x1 = (-b / denom).toFixed(3);
      x2 = x1;
      type = 'single';
    } else {
      x1 = ((-b + Math.sqrt(disc)) / denom).toFixed(3);
      x2 = ((-b - Math.sqrt(disc)) / denom).toFixed(3);
      type = 'real';
    }

    return {
      disc,
      x1,
      x2,
      type,
      steps: {
        discriminant: `(${b})² - 4(${a})(${c}) = ${disc}`,
        numerator1: `${-b} + √${disc < 0 ? Math.abs(disc) + 'i' : disc}`,
        numerator2: `${-b} - √${disc < 0 ? Math.abs(disc) + 'i' : disc}`,
        denominator: `2(${a}) = ${denom}`
      }
    };
  }, [a, b, c]);

  const handleAiExplain = async () => {
    setIsExplaining(true);
    try {
      const text = await explainQuadratic(a, b, c);
      setAiExplanation(text);
    } catch (err) {
      setAiExplanation("I'm having trouble connecting right now.");
    } finally {
      setIsExplaining(false);
    }
  };

  const handleChallenge = async () => {
    const res = await generateChallenge();
    setA(res.a);
    setB(res.b);
    setC(res.c);
    setAiExplanation(`Challenge: ${res.hint}`);
  };

  const handleAskTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;
    
    const query = userQuery;
    setUserQuery("");
    setChatHistory(prev => [...prev, { role: 'user', text: query }]);
    
    setIsExplaining(true);
    try {
      const reply = await askTutor(query, a, b, c);
      setChatHistory(prev => [...prev, { role: 'ai', text: reply || "I'm not sure about that." }]);
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 font-sans selection:bg-blue-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Controls */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h1 className="text-2xl font-black tracking-tight text-slate-800 mb-1">
              Quadratic<span className="text-blue-600">Lab</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">Visual Math Experience</p>
            
            <div className="flex flex-col gap-2 mb-8">
              <button 
                onClick={() => setActiveView('solver')}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeView === 'solver' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <div className={`p-1.5 rounded-lg ${activeView === 'solver' ? 'bg-white/20' : 'bg-slate-100'}`}>
                  <ICONS.Refresh />
                </div>
                Equation Solver
              </button>
              <button 
                onClick={() => setActiveView('trainer')}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeView === 'trainer' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <div className={`p-1.5 rounded-lg ${activeView === 'trainer' ? 'bg-white/20' : 'bg-slate-100'}`}>
                  <ICONS.Sparkles />
                </div>
                Animated Formula
              </button>
            </div>

            {activeView === 'solver' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-left-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Coef a</label>
                    <span className="font-mono text-sm font-bold" style={{ color: COLORS.a }}>{a}</span>
                  </div>
                  <input type="range" min="-10" max="10" step="1" value={a} onChange={(e) => setA(Number(e.target.value) || 1)} className="w-full accent-[#ff6b6b]" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Coef b</label>
                    <span className="font-mono text-sm font-bold" style={{ color: COLORS.b }}>{b}</span>
                  </div>
                  <input type="range" min="-10" max="10" step="1" value={b} onChange={(e) => setB(Number(e.target.value))} className="w-full accent-[#4ecdc4]" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Coef c</label>
                    <span className="font-mono text-sm font-bold" style={{ color: COLORS.c }}>{c}</span>
                  </div>
                  <input type="range" min="-10" max="10" step="1" value={c} onChange={(e) => setC(Number(e.target.value))} className="w-full accent-[#ffe66d]" />
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <button onClick={handleChallenge} className="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200">
                    <ICONS.Sparkles /> Generar Desafío
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-3xl shadow-xl text-white">
            <h3 className="font-black text-lg mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Equation
            </h3>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10">
              <span className="text-xl font-mono font-bold tracking-tighter">
                <span style={{ color: COLORS.a }}>{a}</span>x² {b >= 0 ? '+' : ''}<span style={{ color: COLORS.b }}>{b}</span>x {c >= 0 ? '+' : ''}<span style={{ color: COLORS.c }}>{c}</span> = 0
              </span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-9 space-y-8">
          <AnimatePresence mode="wait">
            {activeView === 'solver' ? (
              <motion.div
                key="solver"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Geometric Plot</h3>
                    <Graph a={a} b={b} c={c} />
                  </div>

                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between">
                    <div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Quick Stats</h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Root Nature</span>
                          <span className={`text-lg font-black ${solution.type === 'complex' ? 'text-purple-600' : 'text-blue-600'}`}>
                            {solution.type === 'complex' ? 'Imaginaria' : solution.type === 'single' ? 'Real Única' : 'Dos Reales'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                            <span className="block text-[10px] font-bold text-blue-400 uppercase mb-1 tracking-wider">x₁</span>
                            <span className="text-sm font-mono font-black text-blue-700">{solution.x1}</span>
                          </div>
                          <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                            <span className="block text-[10px] font-bold text-blue-400 uppercase mb-1 tracking-wider">x₂</span>
                            <span className="text-sm font-mono font-black text-blue-700">{solution.x2}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button onClick={handleAiExplain} disabled={isExplaining} className="mt-6 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200">
                      <ICONS.Info /> {isExplaining ? 'Pensando...' : 'Analizar con AI'}
                    </button>
                  </div>
                </section>

                <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8 pb-4 border-b border-slate-100">Step-by-Step Resolution</h3>
                  <div className="space-y-12">
                    <div className="flex items-start gap-6">
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-700">Discriminant</h4>
                        <div className="bg-slate-50 px-6 py-4 rounded-2xl font-mono text-xl font-bold border border-slate-100">
                          Δ = {solution.steps.discriminant}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-6">
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                      <div className="space-y-4">
                        <h4 className="font-bold text-slate-700">Substitution</h4>
                        <div className="flex items-center gap-6 font-mono text-xl font-bold flex-wrap">
                          <div className="text-center">
                            <div className="border-b-2 border-slate-800 px-4 pb-1">{solution.steps.numerator1}</div>
                            <div className="pt-1">{solution.steps.denominator}</div>
                          </div>
                          <span className="text-slate-300">and</span>
                          <div className="text-center">
                            <div className="border-b-2 border-slate-800 px-4 pb-1">{solution.steps.numerator2}</div>
                            <div className="pt-1">{solution.steps.denominator}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </motion.div>
            ) : (
              <motion.div
                key="trainer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <MemorizationAnimation />
              </motion.div>
            )}
          </AnimatePresence>

          {aiExplanation && activeView === 'solver' && (
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-3xl shadow-lg border-2 border-blue-500 overflow-hidden relative"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500 rounded-lg text-white">
                  <ICONS.Sparkles />
                </div>
                <h3 className="font-black text-xl text-blue-900">AI Tutor Insight</h3>
              </div>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                {aiExplanation}
              </div>
            </motion.section>
          )}
        </main>
      </div>
      
      <footer className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-200 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
        Interactive Learning Experience &bull; Gemini Flash Powered
      </footer>
    </div>
  );
}

import React from 'react';
import { Target } from 'lucide-react';

const GraficoPEG = ({ pegRatio }) => {
  const peg = Number(pegRatio) || 0;

  // Escala Peter Lynch: < 1.0 (Excelente), 1.0-2.0 (Justo), > 2.0 (Caro)
  const pegVisual = Math.min(Math.max(peg, 0), 3.0);
  const posicaoPonteiro = (pegVisual / 3.0) * 100;

  const getZona = () => {
    if (peg === 0) return { label: 'Sem Dados', color: 'text-slate-500', bar: 'bg-slate-700' };
    if (peg < 1.0) return { label: 'Excelente (Desconto)', color: 'text-emerald-400', bar: 'bg-emerald-500' };
    if (peg <= 2.0) return { label: 'Preço Justo', color: 'text-blue-400', bar: 'bg-blue-500' };
    return { label: 'Sobrevalorizada (Caro)', color: 'text-red-400', bar: 'bg-red-500' };
  };

  const zona = getZona();

  return (
    <div className="w-full space-y-4 pt-4 border-t border-slate-800">
      {/* 1. CABEÇALHO DO GRÁFICO */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Target size={14} className="text-slate-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Escala Peter Lynch
          </span>
        </div>
        <span className={`text-[11px] font-bold uppercase ${zona.color}`}>
          {zona.label}
        </span>
      </div>

      {/* 2. O GRÁFICO (Barra Segmentada com Ponteiro) */}
      <div className="relative h-4 w-full rounded-full overflow-hidden flex border border-slate-950 shadow-inner bg-slate-900">
        {/* Zona Excelente (0 a 1.0) */}
        <div className="h-full w-1/3 bg-emerald-950/40 border-r border-slate-950/50"></div>
        {/* Zona Justa (1.0 a 2.0) */}
        <div className="h-full w-1/3 bg-blue-950/40 border-r border-slate-950/50"></div>
        {/* Zona Caro (> 2.0) */}
        <div className="h-full w-1/3 bg-red-950/40"></div>

        {/* Ponteiro Dinâmico */}
        <div 
          className="absolute top-0 h-full w-1 transition-all duration-1000 ease-out"
          style={{ left: `${posicaoPonteiro}%`, transform: 'translateX(-50%)' }}
        >
          <div className={`w-full h-full ${zona.bar} shadow-[0_0_10px_rgba(255,255,255,0.3)]`}></div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-b-[6px] border-l-transparent border-r-transparent border-b-white"></div>
        </div>
      </div>

      {/* 3. ESCALA DE VALORES TRADUZIDA */}
      <div className="flex justify-between items-start text-[9px] font-mono text-slate-600 tracking-tighter">
        <div className="flex flex-col items-center w-1/3 text-center">
          <span className="text-emerald-500 font-bold uppercase">Excelente</span>
          <span>&lt; 1.0</span>
        </div>
        <div className="flex flex-col items-center w-1/3 text-center border-l border-slate-800">
          <span className="text-blue-400 font-bold uppercase">Preço Justo</span>
          <span>1.0 - 2.0</span>
        </div>
        <div className="flex flex-col items-center w-1/3 text-center border-l border-slate-800">
          <span className="text-red-500 font-bold uppercase">Caro</span>
          <span>&gt; 2.0</span>
        </div>
      </div>
    </div>
  );
};

export default GraficoPEG;
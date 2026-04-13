import React from 'react';
import { Gem, Zap, TrendingUp, ArrowUpRight } from 'lucide-react';
import GraficoPEG from './GraficoPEG';

const CardLynch = ({ peg, dy, growthRate }) => {
  const pegValue = Number(peg) || 0;
  const dyValue = Number(dy) || 0;
  const gValue = Number(growthRate) || 0;
  
  const getStatus = () => {
    if (pegValue === 0) return { icon: <Zap size={24}/>, color: 'text-slate-600', bg: 'bg-slate-950' };
    if (pegValue < 1.0) return { icon: <Gem size={24}/>, color: 'text-emerald-400', bg: 'bg-emerald-950/50' };
    return { icon: <TrendingUp size={24}/>, color: 'text-blue-400', bg: 'bg-blue-950/50' };
  };

  const status = getStatus();

  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col hover:border-slate-700 transition-all">
      
      {/* CABEÇALHO */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-slate-800 ${status.bg} ${status.color}`}>
            {status.icon}
          </div>
          <div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">
              Peter Lynch
            </p>
            <h3 className="text-white text-3xl font-black italic tracking-tighter uppercase leading-none">
              Índice de Lynch
            </h3>
          </div>
        </div>
        <div className="text-right">
          <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-1">PEG Ratio</p>
          <div className={`text-4xl font-black font-mono leading-none ${status.color}`}>
            {pegValue.toFixed(2)}
          </div>
        </div>
      </div>

      {/* MÉTRICAS DE ENTRADA (Crescimento e Yield) */}
      <div className="grid grid-cols-2 gap-4 mb-6 bg-slate-950 p-4 rounded-xl border border-slate-800">
        <div className="text-left border-r border-slate-800 pr-4">
          <p className="text-slate-500 text-[9px] font-black uppercase flex items-center gap-1 mb-1">
            Crescimento (G) <ArrowUpRight size={10} className="text-emerald-500" />
          </p>
          <p className="text-xl font-mono font-bold text-white">
            {gValue.toFixed(2)}%
          </p>
        </div>
        <div className="text-right pl-4">
          <p className="text-slate-500 text-[9px] font-black uppercase mb-1">
            Dividend Yield (DY)
          </p>
          <p className="text-xl font-mono font-bold text-blue-400">
            {dyValue.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* GRÁFICO DE ESCALA TRADUZIDO */}
      <GraficoPEG pegRatio={pegValue} />
      
      {/* NOTA DE RODAPÉ SOBRE O CÁLCULO */}
      <p className="text-[8px] text-slate-600 uppercase font-bold mt-4 tracking-wider text-center">
        Cálculo baseado em Crescimento Estimado + Yield vs P/L Atual
      </p>
    </div>
  );
};

export default CardLynch;
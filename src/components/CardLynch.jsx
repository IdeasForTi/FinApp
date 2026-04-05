import React from 'react';
import { TrendingUp, Info } from 'lucide-react';

const CardLynch = ({ peg, dy }) => {
  // Garantimos que os valores sejam numéricos antes de formatar
  const safePeg = Number(peg) || 0;
  const safeDy = Number(dy) || 0;

  const getStatus = (val) => {
    if (val <= 1.0) return { label: 'Oportunidade', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
    if (val <= 1.5) return { label: 'Justo', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
    return { label: 'Caro', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' };
  };

  const status = getStatus(safePeg);

  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden group">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
            <TrendingUp size={14} /> Índice de Lynch (PEG)
          </h3>
          <p className="text-[10px] text-slate-600 font-medium uppercase">Preço / (Crescimento + DY)</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${status.bg} ${status.color} ${status.border}`}>
          {status.label}
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className={`text-4xl font-black tracking-tighter ${status.color}`}>
          {safePeg.toFixed(2)}
        </span>
      </div>

      <div className="flex items-center gap-4 border-t border-slate-800/50 pt-4 mt-4">
        <div>
          <p className="text-[9px] text-slate-500 uppercase font-bold">DY Considerado</p>
          <p className="text-sm font-mono text-slate-300">{safeDy.toFixed(2)}%</p>
        </div>
        <div className="h-8 w-[1px] bg-slate-800"></div>
        <button className="text-slate-700 hover:text-blue-400 transition-colors">
          <Info size={16} />
        </button>
      </div>
    </div>
  );
};

export default CardLynch;
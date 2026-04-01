import React from 'react';
import Tooltip from './Tooltip';

const CardLynch = ({ peg, dy }) => (
  <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 md:col-span-2 flex flex-col md:flex-row items-center justify-between group relative overflow-visible">
    <div className="text-center md:text-left z-10">
      <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
        <h3 className="text-purple-400 font-black text-xs uppercase tracking-widest">Peter Lynch</h3>
        <Tooltip title="PEG Ratio Ajustado" content="P/L ÷ (Crescimento + Yield). Valores abaixo de 1.0 indicam ações baratas em relação ao seu crescimento." />
      </div>
      <div className="text-2xl font-light text-slate-200">PEG Ratio Ajustado</div>
      <p className="text-[10px] text-slate-600 mt-2 max-w-[250px] uppercase font-bold tracking-tight">Yield de {dy.toFixed(2)}% somado ao crescimento.</p>
    </div>
    <div className="mt-6 md:mt-0 text-center md:text-right z-10">
      <div className="text-7xl font-mono text-purple-500 tracking-tighter">{peg.toFixed(2)}</div>
      <div className={`mt-2 text-[10px] inline-block uppercase font-bold px-4 py-1.5 rounded-lg border ${peg < 1 && peg > 0 ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-slate-800 text-slate-500'}`}>
        {peg < 1 && peg > 0 ? '💎 Oportunidade' : '⚖️ Avaliação Neutra'}
      </div>
    </div>
  </div>
);

export default CardLynch;
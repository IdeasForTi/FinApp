import React from 'react';
import { DollarSign } from 'lucide-react';
import Tooltip from './Tooltip';

const CardBazin = ({ valor, precoAtual }) => (
  <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 relative group overflow-visible">
    <div className="absolute top-4 right-4 opacity-5"><DollarSign size={60} /></div>
    <div className="flex items-center gap-1 mb-2 relative z-10">
      <h3 className="text-emerald-500 font-black text-xs uppercase tracking-widest">DÉCIO BAZIN</h3>
      <Tooltip title="Estratégia Bazin" content="Foca em Dividend Yield mínimo de 6%. Preço Máximo = Proventos ÷ 0,06." />
    </div>
    <div className="text-sm text-slate-500 mb-6 font-medium text-left">Preço Máximo (Yield 6%)</div>
    <div className="text-5xl font-mono text-emerald-400 mb-4 text-left">R$ {valor.toFixed(2)}</div>
    <div className={`flex w-fit px-4 py-1 rounded-full text-[10px] font-bold ${precoAtual < valor ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
      {precoAtual < valor ? '✓ DENTRO DA MARGEM' : '✕ ACIMA DO TETO'}
    </div>
  </div>
);

export default CardBazin;
import React from 'react';
import { ShieldCheck } from 'lucide-react';
import Tooltip from './Tooltip';

const CardGraham = ({ valor, precoAtual }) => (
  <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 relative group text-left overflow-visible">
    <div className="absolute top-4 right-4 opacity-5"><ShieldCheck size={60} /></div>
    <div className="flex items-center gap-1 mb-2 relative z-10">
      <h3 className="text-blue-500 font-black text-xs uppercase tracking-widest">Benjamin Graham</h3>
      <Tooltip title="Valor Intrínseco" content="O preço justo baseado no lucro e valor contábil. Fórmula: √(22,5 × LPA × VPA)." />
    </div>
    <div className="text-sm text-slate-500 mb-6 font-medium">Valor Intrínseco Estimado</div>
    <div className="text-5xl font-mono text-blue-400 mb-4 tracking-tighter">R$ {valor.toFixed(2)}</div>
    <p className="text-[11px] text-slate-400 uppercase font-bold">
      Margem: <span className={valor > precoAtual ? "text-blue-300" : "text-red-400"}>
        {valor > 0 ? (((valor - precoAtual) / valor) * 100).toFixed(2) : "0.00"}%
      </span>
    </p>
  </div>
);

export default CardGraham;
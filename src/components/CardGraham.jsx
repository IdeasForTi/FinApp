import React from 'react';
import { AlertTriangle, TrendingUp, ShieldCheck } from 'lucide-react'; // Importação que faltava

const CardGraham = ({ valor, precoAtual }) => {
  const preco = parseFloat(precoAtual || 0);
  const teto = parseFloat(valor || 0);
  const upside = teto > 0 ? ((teto - preco) / preco) * 100 : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Modelo de Graham</p>
          <h3 className="text-xl font-bold text-white">Valor Intrínseco</h3>
        </div>
        <ShieldCheck className="text-blue-500 w-5 h-5" />
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-3xl font-mono font-black text-white">R$ {teto.toFixed(2)}</p>
          <p className="text-slate-500 text-xs mt-1">Preço Máximo Sugerido</p>
        </div>

        <div className={`flex items-center gap-2 p-3 rounded-lg font-bold text-xs uppercase tracking-tighter ${upside > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
          {upside > 0 ? <TrendingUp size={16} /> : <AlertTriangle size={16} />}
          {upside > 0 ? `Upside: ${upside.toFixed(1)}%` : `Overpriced: ${Math.abs(upside).toFixed(1)}%`}
        </div>
      </div>
    </div>
  );
};

export default CardGraham;
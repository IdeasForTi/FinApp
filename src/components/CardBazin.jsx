import React from 'react';
import { DollarSign, AlertCircle } from 'lucide-react';

const CardBazin = ({ valor, precoAtual }) => {
  // Tratamento de segurança: Garante que sejam números
  const safeValor = Number(valor) || 0;
  const safePreco = Number(precoAtual) || 0;

  // Cálculo da Margem de Segurança
  const margem = safeValor > 0 ? ((safeValor - safePreco) / safeValor) * 100 : 0;
  const isPositivo = safePreco <= safeValor;

  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden group">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
            <DollarSign size={14} /> Método de Bazin
          </h3>
          <p className="text-[10px] text-slate-600 font-medium uppercase">Preço Teto (Dividendos)</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
          isPositivo ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
        }`}>
          {isPositivo ? 'Abaixo do Teto' : 'Acima do Teto'}
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className={`text-4xl font-black tracking-tighter ${isPositivo ? 'text-emerald-400' : 'text-slate-200'}`}>
          R$ {safeValor.toFixed(2)}
        </span>
      </div>

      <div className="flex items-center gap-4 border-t border-slate-800/50 pt-4 mt-4">
        <div>
          <p className="text-[9px] text-slate-500 uppercase font-bold">Margem</p>
          <p className={`text-sm font-mono ${margem > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {margem.toFixed(2)}%
          </p>
        </div>
        <div className="h-8 w-[1px] bg-slate-800"></div>
        <div className="flex-1">
          <p className="text-[9px] text-slate-500 uppercase font-bold flex items-center gap-1">
            <AlertCircle size={10} /> Status
          </p>
          <p className="text-[11px] text-slate-400 leading-tight">
            {isPositivo ? 'Ativo com margem de segurança.' : 'Preço atual excede o teto calculado.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardBazin;
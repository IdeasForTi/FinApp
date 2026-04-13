import React from 'react';
import { DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import GraficoUpside from './GraficoUpside';

const CardBazin = ({ valor, precoAtual }) => {
  const teto = Number(valor) || 0;
  const atual = Number(precoAtual) || 0;
  
  // Margem de segurança baseada no teto de Bazin
  const margem = teto > 0 ? ((teto / atual) - 1) * 100 : 0;
  const isSeguro = atual < teto && teto > 0;

  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col h-full transition-all hover:border-slate-700">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">
            Método de Bazin
          </p>
          <h3 className="text-white text-xl font-bold italic tracking-tighter">PREÇO TETO</h3>
        </div>
        <div className={`p-2 rounded-lg ${isSeguro ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400'}`}>
          {isSeguro ? <TrendingUp size={20} /> : <AlertCircle size={20} />}
        </div>
      </div>

      <div className="mb-6">
        <p className="text-4xl font-black font-mono text-white">
          R$ {teto.toFixed(2)}
        </p>
        <p className={`text-sm font-bold mt-1 ${isSeguro ? 'text-emerald-500' : 'text-red-400'}`}>
          {isSeguro ? `Margem: +${margem.toFixed(2)}%` : `Acima do Teto: ${margem.toFixed(2)}%`}
        </p>
      </div>

      {/* GRÁFICO INTEGRADO: Agora o alvo é o Preço Teto Bazin */}
      <div className="mt-auto pt-4 border-t border-slate-800">
        <GraficoUpside precoAtual={atual} valorAlvo={teto} tipo="Bazin"/>
      </div>
    </div>
  );
};

export default CardBazin;
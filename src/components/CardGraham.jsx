import React from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import GraficoUpside from './GraficoUpside';

const CardGraham = ({ valor, precoAtual }) => {
  const justo = Number(valor) || 0;
  const atual = Number(precoAtual) || 0;
  
  // Cálculo de Margem de Segurança
  const margem = justo > 0 ? ((justo / atual) - 1) * 100 : 0;
  const isSeguro = atual < justo;

  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">
            Fórmula de Graham
          </p>
          <h3 className="text-white text-xl font-bold italic tracking-tighter">PREÇO JUSTO</h3>
        </div>
        <div className={`p-2 rounded-lg ${isSeguro ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-400'}`}>
          {isSeguro ? <ShieldCheck size={20} /> : <AlertCircle size={20} />}
        </div>
      </div>

      <div className="mb-6">
        <p className="text-4xl font-black font-mono text-white">
          R$ {justo.toFixed(2)}
        </p>
        <p className={`text-sm font-bold mt-1 ${isSeguro ? 'text-emerald-500' : 'text-red-400'}`}>
          {isSeguro ? `Margem: +${margem.toFixed(2)}%` : `Desconto: ${margem.toFixed(2)}%`}
        </p>
      </div>

      {/* GRÁFICO INSERIDO AQUI DENTRO */}
      <div className="mt-auto pt-4 border-t border-slate-800">
        <GraficoUpside precoAtual={atual} valorAlvo={justo} tipo="Graham" />
      </div>
    </div>
  );
};

export default CardGraham;
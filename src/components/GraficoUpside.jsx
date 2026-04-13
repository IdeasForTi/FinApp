import React from 'react';

const GraficoUpside = ({ precoAtual, valorAlvo, tipo }) => {
  const atual = Number(precoAtual) || 0;
  const alvo = Number(valorAlvo) || 0;

  // Cálculo do Upside Real: ((Alvo / Atual) - 1) * 100
  // Se o alvo for 30 e o preço 20, o upside é +50%
  const upside = atual > 0 && alvo > 0 ? ((alvo / atual) - 1) * 100 : 0;
  
  // Percentual de preenchimento da barra (limitado a 100%)
  const percentualBarra = alvo > 0 ? Math.min(Math.max((atual / alvo) * 100, 0), 100) : 0;
  
  // Define os textos baseados no método
  const labels = {
    Bazin: { titulo: 'Preço Teto', cor: 'text-blue-400' },
    Graham: { titulo: 'Preço Justo', cor: 'text-emerald-400' }
  };

  const config = labels[tipo] || { titulo: 'Alvo', cor: 'text-slate-400' };

  return (
    <div className="w-full space-y-3">
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
            Potencial {tipo}
          </span>
          <span className={`text-sm font-bold ${upside >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {upside >= 0 ? `+${upside.toFixed(2)}% Upside` : `${upside.toFixed(2)}% Downside`}
          </span>
        </div>
        <div className="text-right">
          <span className={`text-[10px] font-black uppercase tracking-widest ${config.cor}`}>
            {config.titulo}
          </span>
        </div>
      </div>

      {/* Barra de Progresso */}
      <div className="relative h-2 w-full bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ease-in-out ${
            upside >= 0 ? 'bg-gradient-to-r from-blue-600 to-emerald-500' : 'bg-red-500/50'
          }`}
          style={{ width: `${percentualBarra}%` }}
        />
      </div>

      <div className="flex justify-between text-[9px] font-mono font-bold uppercase text-slate-500">
        <span>Mercado: R$ {atual.toFixed(2)}</span>
        <span>{tipo}: R$ {alvo.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default GraficoUpside;
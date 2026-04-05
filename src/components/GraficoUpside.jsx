import React from 'react';
import { MoveUpRight, AlertTriangle } from 'lucide-react';

const GraficoUpside = ({ precoAtual, valorGraham }) => {
  const current = Number(precoAtual) || 0;
  const target = Number(valorGraham) || 0;
  
  // Cálculo do Upside: ((Alvo / Atual) - 1) * 100
  const upside = current > 0 ? ((target / current) - 1) * 100 : 0;
  
  // Percentual para a barra (limitado entre 0 e 100 para não quebrar o layout)
  const percentualBarra = Math.min(Math.max((current / target) * 100, 0), 100);
  
  const isDescontada = current < target;

  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl lg:col-span-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
            <MoveUpRight size={14} className="text-blue-400" /> Potencial de Valorização (Upside)
          </h3>
          <p className="text-[10px] text-slate-600 font-medium uppercase">Comparativo: Preço Atual vs. Valor de Graham</p>
        </div>
        <div className="text-right">
          <span className={`text-2xl font-black font-mono ${isDescontada ? 'text-emerald-400' : 'text-red-400'}`}>
            {upside > 0 ? `+${upside.toFixed(2)}%` : `${upside.toFixed(2)}%`}
          </span>
        </div>
      </div>

      {/* Container do Gráfico */}
      <div className="relative pt-4 pb-8">
        {/* Trilho da Barra */}
        <div className="h-4 w-full bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-out rounded-full ${
              isDescontada ? 'bg-gradient-to-r from-blue-600 to-emerald-500' : 'bg-red-500/50'
            }`}
            style={{ width: `${percentualBarra}%` }}
          />
        </div>

        {/* Marcadores de Legenda */}
        <div className="flex justify-between mt-3 text-[10px] font-bold uppercase tracking-tighter">
          <div className="text-slate-500">
            <p>R$ 0,00</p>
          </div>
          <div className="absolute transition-all duration-1000" style={{ left: `${percentualBarra}%`, transform: 'translateX(-50%)' }}>
            <div className="w-[2px] h-2 bg-white mx-auto mb-1"></div>
            <p className="text-white whitespace-nowrap bg-slate-800 px-2 py-1 rounded shadow-lg">
              Atual: R$ {current.toFixed(2)}
            </p>
          </div>
          <div className="text-blue-400 text-right">
            <p>Graham: R$ {target.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Rodapé do Componente */}
      <div className="mt-4 p-3 bg-slate-950/50 rounded-xl border border-slate-800/50 flex items-center gap-3">
        {isDescontada ? (
          <>
            <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
              <MoveUpRight size={16} />
            </div>
            <p className="text-[11px] text-slate-400">
              A ação possui um <strong className="text-emerald-400">Upside de {upside.toFixed(2)}%</strong> até atingir seu valor intrínseco.
            </p>
          </>
        ) : (
          <>
            <div className="bg-red-500/20 p-2 rounded-lg text-red-400">
              <AlertTriangle size={16} />
            </div>
            <p className="text-[11px] text-slate-400">
              Atenção: O preço atual está <strong className="text-red-400">acima</strong> do valor justo de Graham (Margem negativa).
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default GraficoUpside;
import React from 'react';
import { MoveUpRight, AlertTriangle, Building2, TrendingUp, Percent } from 'lucide-react';

const CardFII = ({ 
  ticker, 
  precoAtual, 
  rendimentoMensal, 
  vpa, 
  data = {} 
}) => {
  // 1. NORMALIZAÇÃO E CÁLCULOS
  const tickerFinal = ticker || data?.ticker || '---';
  const current = Number(precoAtual) || 0;
  const vpaFinal = Number(vpa) || 1; 
  const rendimento = Number(rendimentoMensal) || 0;
  
  // Cálculo do P/VP (Saúde Patrimonial)
  const pvp = current / vpaFinal;
  
  // Cálculo do DY Anual dinâmico: (Rendimento Mensal * 12) / Preço Atual
  const dyAnual = current > 0 ? ((rendimento * 12) / current) * 100 : 0;
  
  // Cálculo do Preço Teto Bazin para FII (Rendimento Mensal * 12 / 6%)
  const target = (rendimento * 12) / 0.06;
  
  // Margem de Segurança / Upside
  const upside = current > 0 && target > 0 ? ((target / current) - 1) * 100 : 0;
  
  // Barra de progresso (0% a 100%)
  const percentualBarra = Math.min(Math.max((current / target) * 100, 0), 100);
  const isDescontado = current < target && target > 0;

  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl w-full transition-all hover:border-slate-700">
      
      {/* 1. CABEÇALHO: Ticker e Margem de Segurança */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-950 flex items-center justify-center text-emerald-500 border border-slate-800 shadow-inner">
            <Building2 size={28} />
          </div>
          <div>
            <h3 className="text-white text-3xl font-black tracking-tighter uppercase leading-none">
              {tickerFinal}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-md font-black uppercase tracking-wider">
                Fundo Imobiliário
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.15em] mb-1">Margem de Segurança</p>
          <div className={`text-3xl font-black font-mono leading-none ${isDescontado ? 'text-emerald-400' : 'text-red-500'}`}>
            {target > 0 ? (upside > 0 ? `+${upside.toFixed(2)}%` : `${upside.toFixed(2)}%`) : '0.00%'}
          </div>
        </div>
      </div>

      {/* 2. GRID DE MÉTRICAS PRINCIPAIS (5 Colunas) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
          <p className="text-slate-500 text-[9px] font-black uppercase mb-1">Cotação Atual</p>
          <p className="text-xl font-mono font-bold text-white">R$ {current.toFixed(2)}</p>
        </div>

        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
          <p className="text-blue-400 text-[9px] font-black uppercase mb-1 flex items-center gap-1">
            Rend. Mensal <TrendingUp size={10} />
          </p>
          <p className="text-xl font-mono font-bold text-white">R$ {rendimento.toFixed(2)}</p>
        </div>

        {/* MÉTRICA ADICIONADA: DY ANUAL */}
        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
          <p className="text-emerald-400 text-[9px] font-black uppercase mb-1 flex items-center gap-1">
            DY Anual <Percent size={10} />
          </p>
          <p className="text-xl font-mono font-bold text-white">{dyAnual.toFixed(2)}%</p>
        </div>

        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
          <p className="text-slate-500 text-[9px] font-black uppercase mb-1">P/VP (Saúde)</p>
          <p className={`text-xl font-mono font-bold ${pvp > 1.05 ? 'text-orange-400' : 'text-emerald-400'}`}>
            {pvp.toFixed(2)}
          </p>
        </div>

        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50 col-span-2 md:col-span-1">
          <p className="text-slate-500 text-[9px] font-black uppercase mb-1">VPA</p>
          <p className="text-xl font-mono font-bold text-slate-300">R$ {vpaFinal.toFixed(2)}</p>
        </div>
      </div>

      {/* 3. VISUALIZAÇÃO DO PREÇO TETO (BARRA DE PROGRESSO) */}
      <div className="relative pt-2 pb-10">
        <div className="flex justify-between items-end mb-2">
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Posicionamento de Preço</span>
           <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Teto Bazin: R$ {target.toFixed(2)}</span>
        </div>
        
        <div className="h-3 w-full bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-out ${
              isDescontado ? 'bg-gradient-to-r from-blue-600 to-emerald-500' : 'bg-red-500/40'
            }`}
            style={{ width: `${percentualBarra}%` }}
          />
        </div>

        {/* Marcador Flutuante do Preço Atual */}
        <div 
          className="absolute transition-all duration-1000 top-[34px]" 
          style={{ left: `${percentualBarra}%`, transform: 'translateX(-50%)' }}
        >
          <div className="w-1 h-4 bg-white mx-auto shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
          <div className="mt-1 bg-white text-slate-950 text-[10px] font-black px-2 py-1 rounded shadow-xl whitespace-nowrap">
            ATUAL: R$ {current.toFixed(2)}
          </div>
        </div>
      </div>

      {/* 4. FOOTER DE STATUS */}
      <div className={`mt-6 p-4 rounded-xl border flex items-center gap-4 ${
        isDescontado ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'
      }`}>
        <div className={`p-2 rounded-lg ${isDescontado ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
          {isDescontado ? <MoveUpRight size={20} /> : <AlertTriangle size={20} />}
        </div>
        <div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isDescontado ? (
              <>O ativo está sendo negociado <strong className="text-emerald-400 uppercase">Abaixo</strong> do preço teto sugerido para um retorno de 6% a.a.</>
            ) : (
              <>O ativo ultrapassou o <strong className="text-red-400 uppercase">Preço Teto</strong>. A margem de segurança atual é inexistente ou negativa.</>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardFII;
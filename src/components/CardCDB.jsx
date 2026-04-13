import React from 'react';
import { Landmark, Calendar, TrendingDown, Wallet, ArrowUpRight, Info } from 'lucide-react';

const CardCDB = ({ capitalInicial, taxaCdiAnual, percentualCdi, meses }) => {
  const capital = Number(capitalInicial) || 0;
  const cdiAnual = Number(taxaCdiAnual) / 100 || 0;
  const cdiPercentual = Number(percentualCdi) / 100 || 0;
  const periodoMeses = Number(meses) || 12;

  // 1. Cálculo da Rentabilidade Bruta
  const taxaEfetivaAnual = cdiAnual * cdiPercentual;
  const taxaMensal = Math.pow(1 + taxaEfetivaAnual, 1 / 12) - 1;
  const montanteBruto = capital * Math.pow(1 + taxaMensal, periodoMeses);
  const lucroBruto = montanteBruto - capital;

  // 2. Regras de IR Regressivo
  const getAliquotaIR = (m) => {
    const dias = m * 30 + 1;
    if (dias <= 180) return 0.225;
    if (dias <= 360) return 0.20;
    if (dias <= 720) return 0.175;
    return 0.15;
  };

  const aliquotaAtiva = getAliquotaIR(periodoMeses);
  const valorIR = lucroBruto * aliquotaAtiva;
  
  // 3. Rendimento Líquido
  const rendimentoLiquido = lucroBruto - valorIR;
  const capitalFinal = capital + rendimentoLiquido;

  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col hover:border-slate-700 transition-all">
      
      {/* CABEÇALHO */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-slate-800 bg-slate-950 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <Landmark size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Simulação CDB</p>
            <h3 className="text-white text-2xl font-black italic tracking-tighter uppercase">Renda Fixa</h3>
          </div>
        </div>
        <div className="text-right">
          <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1 text-red-400">Alíquota IR</p>
          <span className="bg-red-500/10 text-red-400 px-2 py-1 rounded text-xs font-mono font-bold border border-red-500/20">
            -{(aliquotaAtiva * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* RESULTADOS PRINCIPAIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Capital Final (Líquido)</p>
          <p className="text-3xl font-black font-mono text-white leading-none">
            R$ {capitalFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits:2 })}
          </p>
        </div>
        
        <div className="bg-emerald-950/20 p-4 rounded-2xl border border-emerald-500/20">
          <p className="text-emerald-500/70 text-[9px] font-black uppercase tracking-widest mb-1 flex items-center gap-1">
            <ArrowUpRight size={10} /> Rendimento Líquido
          </p>
          <p className="text-3xl font-black font-mono text-emerald-400 leading-none">
            R$ {rendimentoLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits:2 })}
          </p>
        </div>
      </div>

      {/* TABELA REGRESSIVA DE IR (REGRAS) */}
      <div className="mb-6 bg-slate-950/40 rounded-xl border border-slate-800 overflow-hidden">
        <div className="bg-slate-800/50 px-3 py-2 flex items-center gap-2">
          <Info size={12} className="text-blue-400" />
          <span className="text-[9px] font-black uppercase text-slate-300 tracking-widest">Tabela de IR Regressivo</span>
        </div>
        <div className="p-3 grid grid-cols-4 gap-1 text-[8px] uppercase font-bold text-center">
          {[
            { label: 'Até 180d', v: '22.5%', active: aliquotaAtiva === 0.225 },
            { label: '181-360d', v: '20%', active: aliquotaAtiva === 0.20 },
            { label: '361-720d', v: '17.5%', active: aliquotaAtiva === 0.175 },
            { label: '721d+', v: '15%', active: aliquotaAtiva === 0.15 }
            ].map((regra, i) => (
            <div key={i} className={`p-1.5 rounded-lg border transition-all ${regra.active ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 scale-105 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 'border-transparent text-slate-600'}`}>
              <div className="mb-1 opacity-70">{regra.label}</div>
              <div className="font-mono text-[10px]">{regra.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* DETALHAMENTO */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
          <p className="text-slate-600 text-[9px] font-bold uppercase mb-1 tracking-tighter">Rendimento Bruto</p>
          <p className="text-sm font-mono font-bold text-slate-400">R$ {lucroBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits:2 })}</p>
        </div>
        <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50 text-right">
          <p className="text-slate-600 text-[9px] font-bold uppercase mb-1 tracking-tighter">Imposto Retido</p>
          <p className="text-sm font-mono font-bold text-red-400/80">- R$ {valorIR.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits:2 })}</p>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-auto pt-4 border-t border-slate-800 flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase tracking-widest">
        <div className="flex items-center gap-1.5">
          <Wallet size={12} className="text-slate-600" /> R$ {capital.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
        </div>
        <div className="flex items-center gap-1.5">
          <TrendingDown size={12} className="text-slate-600" /> {percentualCdi}% do CDI
        </div>
        <div className="flex items-center gap-1.5 text-blue-400">
          <Calendar size={12} /> {periodoMeses} meses
        </div>
      </div>
      {/* ADICIONE ESTE BLOCO AQUI EMBAIXO: */}
      <div className="mt-4 flex items-center justify-center gap-2 py-2 border-t border-slate-800/50">
        <span className="animate-pulse w-1 h-1 bg-emerald-500 rounded-full"></span>
        <p className="text-[7px] text-slate-600 uppercase font-black tracking-[0.2em]">
          Capitalização Diária • Juros Compostos
        </p>
      </div>
    </div>
  );
};

export default CardCDB;
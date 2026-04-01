import React from 'react';
import { Activity, Search, Loader2, AlertCircle, History, Trash2, ArrowUpRight } from 'lucide-react';

const PainelEntrada = ({ inputs, handleChange, buscarDados, loading, error, historico, limparHistorico, carregarDoHistorico }) => (
  <div className="lg:col-span-4 space-y-6">
    <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl text-left">
      <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-tight mb-6 text-blue-400">
        <Activity size={18} /> Entrada de Dados
      </h2>
      <div className="space-y-4">
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase ml-1">Ticker</label>
            <input name="ticker" value={inputs.ticker} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono text-white" />
          </div>
          <button onClick={buscarDados} disabled={loading} className="bg-blue-600 hover:bg-blue-500 p-3.5 rounded-xl transition-all active:scale-95 disabled:opacity-50">
            {loading ? <Loader2 size={20} className="animate-spin text-white" /> : <Search size={20} className="text-white" />}
          </button>
        </div>
        {error && <div className="text-red-400 text-[10px] bg-red-400/10 p-2 rounded-lg flex items-center gap-2"><AlertCircle size={14}/> {error}</div>}
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase ml-1">Preço Atual (R$)</label>
            <input type="number" step="0.01" name="precoAtual" value={inputs.precoAtual.toFixed(2)} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-emerald-400 outline-none" />
          </div>
          {['lpa', 'vpa', 'crescimento', 'pl'].map((field) => (
            <div key={field}>
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase ml-1">{field.toUpperCase()}</label>
              <input type="number" step="0.01" name={field} value={inputs[field].toFixed(2)} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-white outline-none" />
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
      <div className="flex justify-between items-center mb-4 text-left">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-tight text-slate-400"><History size={18} /> Recentes</h2>
        {historico.length > 0 && (
          <button onClick={limparHistorico} className="text-slate-600 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
        )}
      </div>
      <div className="space-y-2">
        {historico.map((item) => (
          <button key={item.id} onClick={() => carregarDoHistorico(item)} className="w-full flex justify-between items-center p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all group">
            <div className="text-left">
              <span className="font-bold text-blue-400">{item.ticker}</span>
              <span className="text-slate-600 text-[10px] ml-2 font-mono">R$ {item.precoAtual.toFixed(2)}</span>
            </div>
            <ArrowUpRight size={14} className="text-slate-700 group-hover:text-emerald-500 transition-colors" />
          </button>
        ))}
      </div>
    </section>
  </div>
);

export default PainelEntrada;
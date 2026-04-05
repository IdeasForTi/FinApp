import React from 'react';
import { 
  Activity, Search, Loader2, AlertCircle, 
  History, Trash2, ArrowUpRight, Building2, LineChart 
} from 'lucide-react';

const PainelEntrada = ({ 
  inputs, 
  handleChange, 
  buscarDados, 
  loading, 
  error, 
  historico, 
  limparHistorico, 
  carregarDoHistorico,
  isFiiMode,
  setIsFiiMode 
}) => {

  // FILTRO DO HISTÓRICO: Separa o que é FII do que é Ação/Unit
  // Adicionamos o "|| []" para garantir que, se o histórico for undefined, ele use um array vazio
  const historicoFiltrado = (historico || []).filter(item => {
    // Lógica de identificação: FII termina com 11 e geralmente não tem LPA (eps)
    const itemEhFii = item.ticker?.endsWith('11');
    return isFiiMode ? itemEhFii : !itemEhFii;
  });
  

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (value && !isNaN(value)) {
      handleChange({ target: { name, value: parseFloat(value).toFixed(2) } });
    }
  };

  return (
    <div className="lg:col-span-4 space-y-6 text-left">
      {/* 1. SELETOR DE MODO */}
      <section className="bg-slate-900 p-2 rounded-2xl border border-slate-800 shadow-xl flex gap-2">
        <button 
          onClick={() => setIsFiiMode(false)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${!isFiiMode ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <LineChart size={14} /> Modo Ações
        </button>
        <button 
          onClick={() => setIsFiiMode(true)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${isFiiMode ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Building2 size={14} /> Modo FIIs
        </button>
      </section>

      {/* 2. FORMULÁRIO DE ENTRADA (LAYOUT MANTIDO) */}
      <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-tight mb-6 text-slate-400">
          <Activity size={18} className="text-blue-500" /> Parâmetros
        </h2>
        
        <div className="space-y-4">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase ml-1">
                {isFiiMode ? 'Ticker FII' : 'Ticker Ação'}
              </label>
              <input name="ticker" value={inputs.ticker} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 uppercase font-mono text-white outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <button onClick={buscarDados} className="bg-blue-600 p-3.5 rounded-xl transition-all active:scale-95">
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
            </button>
          </div>

          {error && <div className="text-red-400 text-[10px] bg-red-400/10 p-2 rounded-lg border border-red-400/20">{error}</div>}

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase ml-1">Preço Atual (R$)</label>
              <input type="number" name="currentPrice" value={inputs.currentPrice} onChange={handleChange} onBlur={handleBlur} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-emerald-400 outline-none" />
            </div>

            <div className="col-span-2">
              <label className={`block text-[10px] font-bold mb-1 uppercase ml-1 ${isFiiMode ? 'text-emerald-400' : 'text-blue-300'}`}>
                {isFiiMode ? 'Último Rendimento (R$)' : 'Div. Yield Anual (%)'}
              </label>
              <input type="number" name="dividendYield" value={inputs.dividendYield} onChange={handleChange} onBlur={handleBlur} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-white outline-none" />
            </div>

            {!isFiiMode && (
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase ml-1">LPA</label>
                <input type="number" name="eps" value={inputs.eps} onChange={handleChange} onBlur={handleBlur} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-white outline-none" />
              </div>
            )}

            <div className={isFiiMode ? 'col-span-2' : 'col-span-1'}>
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase ml-1">VPA</label>
              <input type="number" name="bvps" value={inputs.bvps} onChange={handleChange} onBlur={handleBlur} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-white outline-none" />
            </div>

            {!isFiiMode && (
              <>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase ml-1">P/L</label>
                  <input type="number" name="peRatio" value={inputs.peRatio} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-white outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase ml-1">Cresc. (%)</label>
                  <input type="number" name="growthRate" value={inputs.growthRate} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-white outline-none" />
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 3. HISTÓRICO DINÂMICO (FILTRADO) */}
      <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-tight text-slate-500">
            <History size={16} /> {isFiiMode ? 'FIIs Recentes' : 'Ações Recentes'}
          </h2>
          {historicoFiltrado.length > 0 && (
            <button onClick={limparHistorico} className="text-slate-600 hover:text-red-400 transition-colors">
              <Trash2 size={16} />
            </button>
          )}
        </div>
        
        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
          {historicoFiltrado.length === 0 ? (
            <div className="py-6 text-center border border-dashed border-slate-800 rounded-xl">
              <p className="text-[10px] text-slate-700 uppercase font-bold tracking-widest">Lista Vazia</p>
            </div>
          ) : (
            historicoFiltrado.map((item) => (
              <button 
                key={item.id} 
                onClick={() => carregarDoHistorico(item)} 
                className={`w-full flex justify-between items-center p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all group border-l-2 ${isFiiMode ? 'hover:border-l-emerald-500' : 'hover:border-l-blue-500'}`}
              >
                <div className="text-left">
                  <span className={`font-black text-xs uppercase ${isFiiMode ? 'text-emerald-400' : 'text-blue-400'}`}>{item.ticker}</span>
                  <div className="text-slate-600 text-[10px] font-mono">R$ {Number(item.currentPrice).toFixed(2)}</div>
                </div>
                <ArrowUpRight size={14} className="text-slate-700 group-hover:text-white transition-colors" />
              </button>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default PainelEntrada;
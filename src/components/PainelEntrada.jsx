import React from 'react';
import { Activity, Search, Loader2, History, ArrowUpRight, Building2, LineChart } from 'lucide-react';

const PainelEntrada = ({ 
  mainTab, inputs, handleChange, buscarDados, loading, error, 
  isFiiMode, setIsFiiMode, historyVariavel = [], historyFixa = [], setInputs, salvarCalculoFixa 
}) => {

  // FILTRO: Melhorei a detecção de FII no histórico
  // Considera FII se terminar em 11 ou se tiver sido salvo explicitamente como FII
  const historicoAtivo = mainTab === 'variavel' 
    ? (historyVariavel || []).filter(item => {
        const isItemFii = item.ticker?.endsWith('11') || item.isFii; 
        return isFiiMode ? isItemFii : !isItemFii;
      })
    : (historyFixa || []);

  return (
    <div className="space-y-6 text-left">
      
      {/* SELETOR DE CATEGORIA (VARIÁVEL) */}
      {mainTab === 'variavel' && (
        <div className="bg-slate-900 p-2 rounded-2xl border border-slate-800 flex gap-2">
          <button 
            onClick={() => setIsFiiMode(false)} 
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all ${!isFiiMode ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-400'}`}
          >
            <LineChart size={14}/> Ações
          </button>
          <button 
            onClick={() => setIsFiiMode(true)} 
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all ${isFiiMode ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-400'}`}
          >
            <Building2 size={14}/> FIIs
          </button>
        </div>
      )}

      {/* PAINEL DE PARÂMETROS */}
      <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Indicador visual de erro */}
        {error && (
          <div className="absolute top-0 left-0 right-0 bg-red-500/10 border-b border-red-500/20 py-1 px-4">
            <p className="text-[9px] font-bold text-red-400 uppercase text-center">{error}</p>
          </div>
        )}

        <h2 className={`flex items-center gap-2 text-xs font-black uppercase mb-6 tracking-widest ${error ? 'mt-4' : ''} text-slate-400`}>
          <Activity size={16} className={mainTab === 'fixa' ? 'text-emerald-500' : (isFiiMode ? 'text-emerald-500' : 'text-blue-500')} />
          Parâmetros {mainTab === 'fixa' ? 'CDB' : (isFiiMode ? 'FII' : 'Ação')}
        </h2>

        {mainTab === 'variavel' ? (
          <div className="space-y-4">
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="text-[9px] font-bold text-slate-500 uppercase ml-1 tracking-tighter">Ticker</label>
                <input 
                  name="ticker" 
                  placeholder="EX: BBAS3"
                  value={inputs.ticker || ''} 
                  onChange={handleChange} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono uppercase outline-none focus:ring-1 focus:ring-blue-500 text-white transition-all placeholder:text-slate-800" 
                />
              </div>
              <button 
                onClick={buscarDados} 
                disabled={loading} 
                className={`${isFiiMode ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-blue-600 hover:bg-blue-500'} p-3.5 rounded-xl transition-all active:scale-95 shadow-lg disabled:opacity-50`}
              >
                {loading ? <Loader2 size={20} className="animate-spin text-white" /> : <Search size={20} className="text-white" />}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-white">
              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase ml-1">Preço Atual</label>
                <input type="number" name="currentPrice" value={inputs.currentPrice || ''} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono outline-none focus:border-slate-600" />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase ml-1">{isFiiMode ? 'Rend. Mensal R$' : 'Div. Yield %'}</label>
                <input type="number" name="dividendYield" value={inputs.dividendYield || ''} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-emerald-400 outline-none focus:border-emerald-900" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-white">
              {!isFiiMode && (
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase ml-1">LPA</label>
                  <input type="number" name="eps" value={inputs.eps || ''} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono outline-none focus:border-slate-600" />
                </div>
              )}
              <div className={isFiiMode ? "col-span-2" : ""}>
                <label className="text-[9px] font-bold text-slate-500 uppercase ml-1">VPA</label>
                <input type="number" name="bvps" value={inputs.bvps || ''} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono outline-none focus:border-slate-600" />
              </div>
            </div>

            {!isFiiMode && (
              <div className="grid grid-cols-2 gap-3 text-white">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase ml-1">P/L Atual</label>
                  <input type="number" name="peRatio" value={inputs.peRatio || ''} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono outline-none focus:border-slate-600" />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase ml-1">Crescimento %</label>
                  <input type="number" name="growthRate" value={inputs.growthRate || ''} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-blue-400 outline-none focus:border-blue-900" />
                </div>
              </div>
            )}
          </div>
        ) : (
          /* RENDA FIXA */
          <div className="space-y-4 text-white">
            <div>
              <label className="text-[9px] font-bold text-slate-500 uppercase ml-1">Capital Inicial</label>
              <input type="number" name="cdiCapital" value={inputs.cdiCapital || ''} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-emerald-400 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase ml-1">Taxa CDI %</label>
                <input type="number" name="cdiTaxaAnual" value={inputs.cdiTaxaAnual || ''} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono outline-none" />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase ml-1">% do CDI</label>
                <input type="number" name="cdiRentabilidade" value={inputs.cdiRentabilidade || ''} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-emerald-400 outline-none" />
              </div>
            </div>
            <div>
              <label className="text-[9px] font-bold text-slate-500 uppercase ml-1">Meses</label>
              <input type="number" name="cdiMeses" value={inputs.cdiMeses || ''} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono outline-none" />
            </div>
            <button 
              onClick={salvarCalculoFixa} 
              className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-xl font-black text-[10px] uppercase mt-2 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-900/20 text-white"
            >
              <History size={14}/> Salvar Simulação
            </button>
          </div>
        )}
      </section>

      {/* HISTÓRICO */}
      <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <h2 className="flex items-center gap-2 text-xs font-black uppercase text-slate-500 mb-4 tracking-widest">
          <History size={16}/> Histórico recente
        </h2>
        <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
          {historicoAtivo.length === 0 ? (
            <p className="text-[10px] text-slate-700 uppercase font-bold text-center py-8 border border-dashed border-slate-800 rounded-xl italic">
              Nenhum registro encontrado
            </p>
          ) : (
            historicoAtivo.map((item) => (
              <button 
                key={item.id} 
                onClick={() => setInputs(item)} 
                className={`w-full flex justify-between items-center p-3 bg-slate-950 border border-slate-800 rounded-xl hover:bg-slate-800 group transition-all border-l-2 ${mainTab === 'fixa' ? 'hover:border-l-emerald-500' : (isFiiMode ? 'hover:border-l-emerald-500' : 'hover:border-l-blue-500')}`}
              >
                <div className="text-left">
                  <span className="font-black text-[10px] uppercase text-slate-200">
                    {mainTab === 'fixa' ? `R$ ${Number(item.cdiCapital).toLocaleString('pt-BR')}` : item.ticker}
                  </span>
                  <p className="text-[9px] text-slate-600 font-mono">
                    {mainTab === 'fixa' 
                      ? `${item.cdiRentabilidade}% CDI • ${item.cdiMeses}m` 
                      : `R$ ${item.currentPrice} • ${isFiiMode ? 'FII' : 'Ação'}`}
                  </p>
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
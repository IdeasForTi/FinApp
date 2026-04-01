import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, DollarSign, ShieldCheck, Activity, 
  Search, Loader2, AlertCircle, History, Trash2, ArrowUpRight 
} from 'lucide-react';

const StockApp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [historico, setHistorico] = useState([]); // Novo Estado para o Histórico
  
  const [inputs, setInputs] = useState({
    ticker: 'BBAS3',
    precoAtual: 27.50,
    dividendo: 2.20,
    lpa: 5.80,
    vpa: 32.10,
    pl: 4.7,
    crescimento: 10
  });

  // --- LÓGICA DO HISTÓRICO ---
  
  // Carregar do localStorage ao iniciar
  useEffect(() => {
    const salvo = localStorage.getItem('historicoAcoes');
    if (salvo) setHistorico(JSON.parse(salvo));
  }, []);

  // Salvar no localStorage sempre que o histórico mudar
  useEffect(() => {
    localStorage.setItem('historicoAcoes', JSON.stringify(historico));
  }, [historico]);

  const adicionarAoHistorico = (dados) => {
    const novoItem = { ...dados, id: Date.now() };
    // Mantém apenas as últimas 5 pesquisas e evita duplicados seguidos
    setHistorico(prev => {
      const filtrado = prev.filter(item => item.ticker !== dados.ticker);
      return [novoItem, ...filtrado].slice(0, 5);
    });
  };

  const limparHistorico = () => setHistorico([]);

  const carregarDoHistorico = (item) => setInputs(item);

  // --- FIM DA LÓGICA DO HISTÓRICO ---

  const buscarDados = async () => {
    if (!inputs.ticker) return;
    setLoading(true);
    setError('');
    
    try {
      const token = 'sxKPbJ9GaFUK9wPWB3Zjs9'; // <--- COLOQUE SEU TOKEN AQUI
      const response = await fetch(`https://brapi.dev/api/quote/${inputs.ticker.toUpperCase()}?token=${token}&fundamental=true`);
      const data = await response.json();
      
      if (data.results && data.results[0]) {
        const stock = data.results[0];
        const novosDados = {
          ...inputs,
          precoAtual: stock.regularMarketPrice || inputs.precoAtual,
          dividendo: stock.dividendYield ? (stock.regularMarketPrice * (stock.dividendYield / 100)) : inputs.dividendo,
          lpa: stock.priceEarnings ? (stock.regularMarketPrice / stock.priceEarnings) : inputs.lpa,
          vpa: stock.bookValuePerShare || inputs.vpa,
          pl: stock.priceEarnings || inputs.pl
        };
        setInputs(novosDados);
        adicionarAoHistorico(novosDados); // Salva no histórico após a busca
      } else {
        setError('Ticker não encontrado.');
      }
    } catch (err) {
      setError('Erro na conexão.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: name === 'ticker' ? value : parseFloat(value) || 0 }));
  };

  // Cálculos
  const tetoBazin = inputs.dividendo / 0.06;
  const valorJustoGraham = Math.sqrt(Math.max(0, 22.5 * inputs.lpa * inputs.vpa));
  const pegRatio = inputs.crescimento > 0 ? (inputs.pl / inputs.crescimento) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <header className="max-w-7xl mx-auto mb-10 flex justify-between items-center border-b border-slate-900 pb-6">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent italic">
            Ideas: Value Analyzer Pro
          </h1>
          <p className="text-slate-500 text-[10px] uppercase tracking-widest">Ideasfor soluction v2.0</p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-slate-400 text-xs font-mono">Status da API: <span className="text-emerald-500 underline">Conectado</span></p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUNA ESQUERDA: INPUTS E HISTÓRICO (4 colunas) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Painel de Busca */}
          <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-tight mb-6 text-blue-400">
              <Activity size={18} /> Entrada de Dados
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Ticker</label>
                  <input name="ticker" value={inputs.ticker} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono" />
                </div>
                <button onClick={buscarDados} disabled={loading} className="bg-blue-600 hover:bg-blue-500 p-3.5 rounded-xl transition-all active:scale-95 disabled:opacity-50">
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                </button>
              </div>

              {error && <div className="text-red-400 text-[10px] bg-red-400/10 p-2 rounded-lg flex items-center gap-2"><AlertCircle size={14}/> {error}</div>}

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Preço (R$)</label>
                  <input type="number" name="precoAtual" value={inputs.precoAtual.toFixed(2)} step="0.01" 
                    onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-emerald-400" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">LPA</label>
                  <input type="number" name="lpa" value={inputs.lpa.toFixed(2)} step="0.01" 
                    onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">VPA</label>
                  <input type="number" name="vpa" value={inputs.vpa.toFixed(2)} step="0.01" 
                    onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono" />
                </div>
              </div>
            </div>
          </section>

          {/* Painel de Histórico */}
          <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-tight text-slate-400">
                <History size={18} /> Recentes
              </h2>
              {historico.length > 0 && (
                <button onClick={limparHistorico} className="text-slate-600 hover:text-red-400 transition-colors">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            
            <div className="space-y-2">
              {historico.length === 0 ? (
                <p className="text-slate-600 text-[10px] italic">Nenhuma ação recente...</p>
              ) : (
                historico.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => carregarDoHistorico(item)}
                    className="w-full flex justify-between items-center p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all group text-left"
                  >
                    <div>
                      <span className="font-bold text-blue-400">{item.ticker}</span>
                      <span className="text-slate-600 text-[10px] ml-2 font-mono">R$ {item.precoAtual.toFixed(2)}</span>
                    </div>
                    <ArrowUpRight size={14} className="text-slate-700 group-hover:text-emerald-500 transition-colors" />
                  </button>
                ))
              )}
            </div>
          </section>
        </div>

        {/* COLUNA DIREITA: RESULTADOS (8 colunas) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Bazin */}
          <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5"><DollarSign size={80} /></div>
             <h3 className="text-emerald-500 font-black text-xs uppercase mb-2">DÉCIO BAZIN</h3>
             <div className="text-sm text-slate-500 mb-6 font-medium">Preço Máximo de Compra</div>
             <div className="text-5xl font-mono text-emerald-400 mb-4">R$ {tetoBazin.toFixed(2)}</div>
             <div className={`inline-block px-4 py-1 rounded-full text-[10px] font-bold ${inputs.precoAtual < tetoBazin ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                {inputs.precoAtual < tetoBazin ? '✓ DENTRO DA MARGEM' : '✕ ACIMA DO TETO'}
             </div>
          </div>

          {/* Card Graham */}
          <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5"><ShieldCheck size={80} /></div>
             <h3 className="text-blue-500 font-black text-xs uppercase mb-2">Benjamin Graham</h3>
             <div className="text-sm text-slate-500 mb-6 font-medium">Valor Intrínseco Estimado</div>
             <div className="text-5xl font-mono text-blue-400 mb-4">R$ {valorJustoGraham.toFixed(2)}</div>
             <p className="text-xs text-slate-400">Margem: <span className="text-blue-300 font-mono">{((valorJustoGraham - inputs.precoAtual) / valorJustoGraham * 100).toFixed(1)}%</span></p>
          </div>

          {/* Card Lynch */}
          <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 md:col-span-2 flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left">
              <h3 className="text-purple-400 font-black text-xs uppercase mb-2">Peter Lynch</h3>
              <div className="text-2xl font-light text-slate-200">PEG Ratio</div>
              <p className="text-xs text-slate-600 mt-2 max-w-[200px]">P/L dividido pelo Crescimento. Ideal abaixo de 1.0.</p>
            </div>
            <div className="mt-6 md:mt-0">
              <div className="text-7xl font-mono text-purple-500 tracking-tighter">{pegRatio.toFixed(2)}</div>
              <div className="text-[10px] text-center uppercase font-bold text-slate-500 mt-2">{pegRatio < 1 ? '💎 Oportunidade' : '⚖️ Avaliação Justa'}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StockApp;
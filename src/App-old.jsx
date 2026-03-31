import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, DollarSign, ShieldCheck, Activity, 
  Search, Loader2, AlertCircle, History, Trash2 
} from 'lucide-react';

const StockApp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [historico, setHistorico] = useState([]);
  
  const [inputs, setInputs] = useState({
    ticker: 'BBAS3',
    precoAtual: 27.50,
    dividendo: 2.20,
    lpa: 5.80,
    vpa: 32.10,
    pl: 4.7,
    crescimento: 10
  });

  // --- PERSISTÊNCIA ---
  useEffect(() => {
    const salvo = localStorage.getItem('finApp_history');
    if (salvo) setHistorico(JSON.parse(salvo));
  }, []);

  useEffect(() => {
    localStorage.setItem('finApp_history', JSON.stringify(historico));
  }, [historico]);

  const buscarDados = async () => {
    if (!inputs.ticker) return;
    setLoading(true);
    setError('');
    
    try {
      const token = 'sxKPbJ9GaFUK9wPWB3Zjs9'; // Substitua pelo seu token da brapi.dev
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
        
        // Adiciona ao histórico (evitando duplicatas próximas)
        setHistorico(prev => {
          const filtrado = prev.filter(item => item.ticker !== novosDados.ticker);
          return [novosDados, ...filtrado].slice(0, 4); // Mantém os 4 últimos
        });
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

  // Cálculos Automáticos
  const tetoBazin = inputs.dividendo / 0.06;
  const valorJustoGraham = Math.sqrt(Math.max(0, 22.5 * inputs.lpa * inputs.vpa));
  const pegRatio = inputs.crescimento > 0 ? (inputs.pl / inputs.crescimento) : 0;
  const margemGraham = valorJustoGraham > 0 ? ((valorJustoGraham - inputs.precoAtual) / valorJustoGraham) * 100 : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <header className="max-w-6xl mx-auto mb-10 text-center">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent italic tracking-tight">
          ValueAnalyzer Pro
        </h1>
        <p className="text-slate-500 mt-2 text-xs uppercase tracking-[0.3em]">Bazin • Graham • Lynch</p>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Painel de Inputs (Layout Original) */}
        <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-blue-400">
            <Activity size={20} /> Dados da Empresa
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Ticker</label>
                <input name="ticker" value={inputs.ticker} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono" />
              </div>
              <button onClick={buscarDados} disabled={loading} className="bg-blue-600 hover:bg-blue-500 p-3.5 rounded-xl transition-all disabled:opacity-50">
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
              </button>
            </div>

            {error && <div className="text-red-400 text-[10px] bg-red-400/10 p-2 rounded-lg flex items-center gap-2"><AlertCircle size={14}/> {error}</div>}

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Preço Atual (R$)</label>
                <input type="number" name="precoAtual" value={inputs.precoAtual} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-emerald-400 font-mono" />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Div. Anual</label>
                <input type="number" name="dividendo" value={inputs.dividendo} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 font-mono" />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">LPA</label>
                <input type="number" name="lpa" value={inputs.lpa} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 font-mono" />
              </div>
            </div>

            {/* Sub-sessão de Histórico dentro do painel lateral */}
            {historico.length > 0 && (
              <div className="pt-4 border-t border-slate-800">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1"><History size={12}/> Recentes</span>
                  <button onClick={() => setHistorico([])} className="text-slate-600 hover:text-red-400"><Trash2 size={12}/></button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {historico.map((item, i) => (
                    <button key={i} onClick={() => setInputs(item)} className="text-[10px] bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg hover:border-blue-500 transition-colors font-mono">
                      {item.ticker}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Coluna de Resultados (2 colunas originais) */}
        <section className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card Bazin */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 relative overflow-hidden group">
            <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><DollarSign size={100} /></div>
            <h3 className="text-emerald-500 font-bold uppercase text-[10px] tracking-widest mb-1">Método Bazin</h3>
            <p className="text-xl font-light text-slate-300 mb-4 italic">Preço Teto (6% Yield)</p>
            <div className="text-4xl font-mono text-emerald-400">R$ {tetoBazin.toFixed(2)}</div>
            <div className={`mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${inputs.precoAtual < tetoBazin ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
              <ShieldCheck size={16} /> {inputs.precoAtual < tetoBazin ? 'Comprar' : 'Aguardar'}
            </div>
          </div>

          {/* Card Graham */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 relative overflow-hidden group">
            <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><TrendingUp size={100} /></div>
            <h3 className="text-blue-500 font-bold uppercase text-[10px] tracking-widest mb-1">Método Graham</h3>
            <p className="text-xl font-light text-slate-300 mb-4 italic">Valor Intrínseco</p>
            <div className="text-4xl font-mono text-blue-400">R$ {valorJustoGraham.toFixed(2)}</div>
            <p className="mt-6 text-sm font-bold uppercase text-slate-500 tracking-tighter">
              Margem: <span className={margemGraham > 20 ? 'text-emerald-400' : 'text-yellow-500'}>{margemGraham.toFixed(1)}%</span>
            </p>
          </div>

          {/* Card Lynch (Destaque Inferior) */}
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 md:col-span-2 flex flex-col md:flex-row justify-between items-center bg-gradient-to-br from-slate-900 to-slate-950">
            <div>
              <h3 className="text-purple-400 font-bold uppercase text-[10px] tracking-widest mb-1">Peter Lynch</h3>
              <p className="text-2xl font-light text-slate-300 mb-2">PEG Ratio (Crescimento)</p>
              <p className="text-slate-600 text-[10px] max-w-sm uppercase tracking-tighter">O preço pago pelo crescimento dos lucros.</p>
            </div>
            <div className="text-center md:text-right mt-6 md:mt-0">
              <div className="text-6xl font-mono text-purple-400 tracking-tighter">{pegRatio.toFixed(2)}</div>
              <div className={`mt-2 text-[10px] font-black uppercase px-3 py-1 rounded-lg ${pegRatio < 1 && pegRatio > 0 ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                Status: {pegRatio < 1 && pegRatio > 0 ? 'Excelente' : 'Caro'}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="max-w-6xl mx-auto mt-12 text-center text-slate-700 text-[9px] uppercase leading-relaxed tracking-[0.2em] pb-10">
        Não é recomendação de investimento • Dados puramente matemáticos
      </footer>
    </div>
  );
};

export default StockApp;
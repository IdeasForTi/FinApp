import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Activity, 
  Search, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';

const StockApp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [inputs, setInputs] = useState({
    ticker: 'BBAS3',
    precoAtual: 27.50,
    dividendo: 2.20,
    lpa: 5.80,
    vpa: 32.10,
    pl: 4.7,
    crescimento: 10
  });

  const [results, setResults] = useState({
    bazin: { teto: 0, status: '' },
    graham: { justo: 0, margem: 0 },
    lynch: { peg: 0, status: '' }
  });

  // Função para buscar dados reais via API Brapi
  const buscarDados = async () => {
    if (!inputs.ticker) return;
    setLoading(true);
    setError('');
    
    try {
      // NOTA: Substitua 'SEU_TOKEN_AQUI' pelo seu token do site brapi.dev
      const token = 'sxKPbJ9GaFUK9wPWB3Zjs9'; 
      const response = await fetch(`https://brapi.dev/api/quote/${inputs.ticker.toUpperCase()}?token=${token}&fundamental=true`);
      const data = await response.json();
      
      if (data.results && data.results[0]) {
        const stock = data.results[0];
        
        setInputs(prev => ({
          ...prev,
          precoAtual: stock.regularMarketPrice || prev.precoAtual,
          // Cálculo estimado de dividendos se a API retornar yield
          dividendo: stock.dividendYield ? (stock.regularMarketPrice * (stock.dividendYield / 100)) : prev.dividendo,
          lpa: stock.priceEarnings ? (stock.regularMarketPrice / stock.priceEarnings) : prev.lpa,
          vpa: stock.bookValuePerShare || prev.vpa,
          pl: stock.priceEarnings || prev.pl
        }));
      } else {
        setError('Ticker não encontrado.');
      }
    } catch (err) {
      setError('Erro na conexão com a API.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ 
      ...prev, 
      [name]: name === 'ticker' ? value : parseFloat(value) || 0 
    }));
  };

  // Cálculo das Metodologias
  useEffect(() => {
    // 1. Bazin (Preço Teto para 6% de Yield)
    const tetoBazin = inputs.dividendo / 0.06;
    
    // 2. Graham (Valor Justo com multiplicador 22.5)
    // Usamos Math.max(0, ...) para evitar erro de raiz quadrada de número negativo
    const valorJustoGraham = Math.sqrt(Math.max(0, 22.5 * inputs.lpa * inputs.vpa));
    
    // 3. Lynch (PEG Ratio)
    const pegRatio = inputs.crescimento > 0 ? (inputs.pl / inputs.crescimento) : 0;

    setResults({
      bazin: { 
        teto: tetoBazin, 
        status: inputs.precoAtual < tetoBazin ? 'Desconto' : 'Caro' 
      },
      graham: { 
        justo: valorJustoGraham, 
        margem: valorJustoGraham > 0 ? ((valorJustoGraham - inputs.precoAtual) / valorJustoGraham) * 100 : 0 
      },
      lynch: { 
        peg: pegRatio, 
        status: pegRatio > 0 && pegRatio < 1 ? 'Excelente' : 'Atenção' 
      }
    });
  }, [inputs]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <header className="max-w-6xl mx-auto mb-10 text-center">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent italic tracking-tight">
          IdeasFor Stock Pro
        </h1>
        <p className="text-slate-500 mt-2 text-xs uppercase tracking-[0.3em]">Fundamentalismo Estratégico</p>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Formulário de Dados */}
        <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-2xl h-fit">
          <h2 className="flex items-center gap-2 text-lg font-semibold mb-6">
            <Activity size={20} className="text-blue-400" /> Dados da Empresa
          </h2>
          
          <div className="space-y-5">
            {/* Campo Ticker com Botão de Busca */}
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 ml-1">Ticker</label>
                <input 
                  name="ticker" 
                  value={inputs.ticker} 
                  onChange={handleChange} 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono" 
                />
              </div>
              <button 
                onClick={buscarDados}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 p-3.5 rounded-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center min-w-[50px]"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs bg-red-400/10 p-2 rounded-lg">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 ml-1">Preço Atual (R$)</label>
                <input type="number" name="precoAtual" value={inputs.precoAtual} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 font-mono text-emerald-400" />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 ml-1">Div. Anual (R$)</label>
                <input type="number" name="dividendo" value={inputs.dividendo} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 font-mono" />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 ml-1">LPA (Lucro)</label>
                <input type="number" name="lpa" value={inputs.lpa} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 font-mono" />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 ml-1">VPA (Patrimônio)</label>
                <input type="number" name="vpa" value={inputs.vpa} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 font-mono" />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 ml-1">P/L Atual</label>
                <input type="number" name="pl" value={inputs.pl} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 font-mono" />
              </div>
            </div>
          </div>
        </section>

        {/* Cards de Resultados */}
        <section className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card Bazin */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 relative overflow-hidden group">
            <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><DollarSign size={100} /></div>
            <h3 className="text-emerald-500 font-bold uppercase text-[10px] tracking-widest mb-1">Estratégia Bazin</h3>
            <p className="text-xl font-light text-slate-300 mb-4 italic">"O dividendo é a prova do lucro."</p>
            <div className="space-y-1">
              <span className="text-slate-500 text-xs">Preço Teto (Yield 6%):</span>
              <div className="text-4xl font-mono text-emerald-400">R$ {results.bazin?.teto.toFixed(2)}</div>
            </div>
            <div className={`mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${results.bazin?.status === 'Desconto' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
              <ShieldCheck size={16} /> {results.bazin?.status}
            </div>
          </div>

          {/* Card Graham */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 relative overflow-hidden group">
            <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><TrendingUp size={100} /></div>
            <h3 className="text-blue-500 font-bold uppercase text-[10px] tracking-widest mb-1">Estratégia Graham</h3>
            <p className="text-xl font-light text-slate-300 mb-4 italic">"Preço é o que você paga, valor é o que leva."</p>
            <div className="space-y-1">
              <span className="text-slate-500 text-xs">Valor Intrínseco (Vi):</span>
              <div className="text-4xl font-mono text-blue-400">R$ {results.graham?.justo.toFixed(2)}</div>
            </div>
            <p className="mt-6 text-sm font-bold">
              Margem de Seg.: <span className={results.graham?.margem > 20 ? 'text-emerald-400' : 'text-yellow-500'}>
                {results.graham?.margem.toFixed(1)}%
              </span>
            </p>
          </div>

          {/* Card Lynch */}
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 md:col-span-2 flex flex-col md:flex-row justify-between items-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900 to-slate-900">
            <div>
              <h3 className="text-purple-400 font-bold uppercase text-[10px] tracking-widest mb-1">Estratégia Peter Lynch</h3>
              <p className="text-2xl font-light text-slate-300 mb-2">PEG Ratio (Growth at Reasonable Price)</p>
              <p className="text-slate-500 text-xs max-w-sm">Avalia se o crescimento esperado justifica o preço pago pelo lucro atual.</p>
            </div>
            <div className="text-center md:text-right mt-6 md:mt-0">
              <div className="text-6xl font-mono text-purple-400 tracking-tighter">{results.lynch?.peg.toFixed(2)}</div>
              <div className={`mt-2 text-[10px] font-black uppercase px-3 py-1 rounded-lg ${results.lynch?.status === 'Excelente' ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                Status: {results.lynch?.status}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="max-w-6xl mx-auto mt-12 text-center text-slate-700 text-[9px] uppercase leading-relaxed tracking-widest pb-10">
        Desenvolvido para análise quantitativa • Não é recomendação de compra <br/>
        Dados baseados em Graham (22.5), Bazin (6% Yield) e Lynch (PEG &lt; 1.0)
      </footer>
    </div>
  );
};

export default StockApp;
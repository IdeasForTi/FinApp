import React, { useState, useEffect } from 'react';
import PainelEntrada from './components/PainelEntrada';
import CardBazin from './components/CardBazin';
import CardGraham from './components/CardGraham';
import CardLynch from './components/CardLynch';

const StockApp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [historico, setHistorico] = useState([]);
  const [inputs, setInputs] = useState({ 
    ticker: 'IDEAS11', 
    precoAtual: 0.00, 
    dividendo: 0.00, // Proventos em R$
    lpa: 5.80, 
    vpa: 0.00, 
    pl: 0.00, 
    crescimento: 10.00 
  });

  useEffect(() => {
    const salvo = localStorage.getItem('historicoAcoes_v3');
    if (salvo) setHistorico(JSON.parse(salvo));
  }, []);

  const buscarDados = async () => {
    setLoading(true); setError('');
    try {
      const response = await fetch(`https://brapi.dev/api/quote/${inputs.ticker.toUpperCase()}?token=sxKPbJ9GaFUK9wPWB3Zjs9&fundamental=false`);
      const data = await response.json();
      
      if (data.results?.[0]) {
        const stock = data.results[0];
        const preco = stock.regularMarketPrice || inputs.precoAtual;
        
        const novosDados = { 
          ...inputs, 
          precoAtual: preco, 
          // Converte o Yield da API (ex: 8.5%) em valor real (R$) baseado no preço atual
          dividendo: stock.dividendYield ? (preco * (stock.dividendYield / 100)) : inputs.dividendo,
          lpa: stock.priceEarnings ? (preco / stock.priceEarnings) : inputs.lpa, 
          vpa: stock.bookValuePerShare || inputs.vpa, 
          pl: stock.priceEarnings || inputs.pl 
        };
        
        setInputs(novosDados);
        const novoHist = [{...novosDados, id: Date.now()}, ...historico.filter(i => i.ticker !== novosDados.ticker)].slice(0, 5);
        setHistorico(novoHist);
        localStorage.setItem('historicoAcoes_v3', JSON.stringify(novoHist));
      }
    } catch { setError('Erro na API'); } finally { setLoading(false); }
  };

  // Cálculos Automáticos
  const tetoBazin = inputs.dividendo / 0.06;
  const valorGraham = Math.sqrt(Math.max(0, 22.5 * inputs.lpa * inputs.vpa));
  const dyAtual = inputs.precoAtual > 0 ? (inputs.dividendo / inputs.precoAtual) * 100 : 0;
  const peg = (inputs.crescimento + dyAtual) > 0 ? (inputs.pl / (inputs.crescimento + dyAtual)) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <header className="max-w-7xl mx-auto mb-10 border-b border-slate-900 pb-6">
        <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent italic tracking-tighter text-left">
          IdeasFor: Finance Pro
        </h1>
        <p className="text-slate-500 text-[10px] uppercase tracking-widest">Ideasfor soluction v2.0</p>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <PainelEntrada 
          inputs={inputs} 
          handleChange={(e) => setInputs({...inputs, [e.target.name]: e.target.name === 'ticker' ? e.target.value : parseFloat(e.target.value) || 0})}
          buscarDados={buscarDados}
          loading={loading}
          error={error}
          historico={historico}
          limparHistorico={() => setHistorico([])}
          carregarDoHistorico={setInputs}
        />

        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardBazin valor={tetoBazin} precoAtual={inputs.precoAtual} />
          <CardGraham valor={valorGraham} precoAtual={inputs.precoAtual} />
          <CardLynch peg={peg} dy={dyAtual} />
        </div>
      </main>

      <footer className="max-w-7xl mx-auto mt-12 text-center text-slate-800 text-[9px] uppercase tracking-[0.4em] pb-10 leading-relaxed border-t border-slate-900 pt-8">
        Quantitative Analysis Engine • Ideasfor solution <br/> 
        Powered by Brapi API • V2.1.0 Build
      </footer>
    </div>
  );
};

export default StockApp;
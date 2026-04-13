import React, { useState, useEffect } from 'react';
import appSettings from './Data/appSettings.json';

import PainelEntrada from './components/PainelEntrada';
import CardBazin from './components/CardBazin';
import CardGraham from './components/CardGraham';
import CardLynch from './components/CardLynch';
import CardFII from './components/CardFII';
import CardCDB from './components/CardCDB';

const StockApp = () => {
  const { BaseUrl, Token } = appSettings.MarketData;
  const { BazinYieldTarget, GrahamMultiplier, DefaultGrowthRate } = appSettings.CalculationsData;
  const { Name, Version, Developer } = appSettings.ApplicationInfoData;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mainTab, setMainTab] = useState('variavel'); 
  const [isFiiMode, setIsFiiMode] = useState(false);
  
  // Estados de Histórico inicializados como array vazio para evitar erros de renderização
  const [historyVariavel, setHistoryVariavel] = useState([]);
  const [historyFixa, setHistoryFixa] = useState([]);

  const [inputs, setInputs] = useState({ 
    ticker: 'BBAS3',
    currentPrice: '0.00',
    dividendYield: '0.00',
    eps: '0.00',
    bvps: '0.00',
    peRatio: '0.00',
    growthRate: DefaultGrowthRate,
    cdiCapital: '1000.00',
    cdiTaxaAnual: '10.75',
    cdiRentabilidade: '100',
    cdiMeses: '12'
  });

  // Carregar dados do LocalStorage ao montar o componente
  useEffect(() => {
    const savedVariavel = localStorage.getItem('historicoVariavel_v5');
    const savedFixa = localStorage.getItem('historicoFixa_v5');
    if (savedVariavel) setHistoryVariavel(JSON.parse(savedVariavel));
    if (savedFixa) setHistoryFixa(JSON.parse(savedFixa));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const salvarNoHistoricoVariavel = (dados) => {
    setHistoryVariavel(prev => {
      const filtrado = (prev || []).filter(h => h.ticker !== dados.ticker);
      const novo = [{ ...dados, id: Date.now() }, ...filtrado].slice(0, 10);
      localStorage.setItem('historicoVariavel_v5', JSON.stringify(novo));
      return novo;
    });
  };

  const salvarCalculoFixa = () => {
    if (!inputs.cdiCapital) return;
    setHistoryFixa(prev => {
      const novo = [{ ...inputs, id: Date.now() }, ...(prev || [])].slice(0, 10);
      localStorage.setItem('historicoFixa_v5', JSON.stringify(novo));
      return novo;
    });
  };

  const fetchData = async () => {
    if (!inputs.ticker || mainTab === 'fixa') return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${BaseUrl}${inputs.ticker.toUpperCase()}?token=${Token}`);
      const data = await response.json();
      if (data.results?.[0]) {
        const stock = data.results[0];
        const novosDados = {
          ...inputs,
          ticker: stock.symbol,
          currentPrice: stock.regularMarketPrice?.toFixed(2) || inputs.currentPrice,
          eps: stock.earningsPerShare?.toFixed(2) || inputs.eps,
          peRatio: stock.priceEarnings?.toFixed(2) || inputs.peRatio,
          bvps: stock.bookValuePerShare?.toFixed(2) || inputs.bvps,
        };
        setInputs(novosDados);
        salvarNoHistoricoVariavel(novosDados);
      }
    } catch (err) { setError('Erro na API'); }
    finally { setLoading(false); }
  };

  const m = (() => {
    const p = Number(inputs.currentPrice);
    const dy = Number(inputs.dividendYield);
    const metaYield = BazinYieldTarget || 0.06;
    if (isFiiMode) return { tetoBazin: (dy * 12) / metaYield };
    return {
      tetoBazin: (p * (dy / 100)) / metaYield,
      graham: Math.sqrt(GrahamMultiplier * Number(inputs.eps) * Number(inputs.bvps)),
      peg: Number(inputs.peRatio) / (Number(inputs.growthRate) + dy)
    };
  })();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <header className="max-w-7xl mx-auto mb-6 flex justify-between items-center border-b border-slate-900 pb-6">
        <div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">{Name}</h1>
          <p className="text-[8px] text-slate-600 font-bold uppercase">{Developer} | v{Version}</p>
        </div>
        <nav className="flex gap-2 bg-slate-900 p-1 rounded-xl">
          <button onClick={() => setMainTab('variavel')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${mainTab === 'variavel' ? 'bg-blue-600 shadow-lg' : 'text-slate-500'}`}>Variável</button>
          <button onClick={() => setMainTab('fixa')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${mainTab === 'fixa' ? 'bg-emerald-600 shadow-lg' : 'text-slate-500'}`}>Fixa</button>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-4">
          <PainelEntrada 
            mainTab={mainTab}
            inputs={inputs}
            handleChange={handleChange}
            buscarDados={fetchData}
            loading={loading}
            error={error}
            isFiiMode={isFiiMode}
            setIsFiiMode={setIsFiiMode}
            historyVariavel={historyVariavel || []}
            historyFixa={historyFixa || []}
            setInputs={setInputs}
            salvarCalculoFixa={salvarCalculoFixa}
          />
        </aside>

        <section className="lg:col-span-8 space-y-6">
          {mainTab === 'variavel' ? (
            isFiiMode ? (
              <CardFII ticker={inputs.ticker} precoAtual={inputs.currentPrice} rendimentoMensal={inputs.dividendYield} vpa={inputs.bvps} metaYield={BazinYieldTarget} />
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CardBazin valor={m.tetoBazin} precoAtual={inputs.currentPrice} />
                  <CardGraham valor={m.graham} precoAtual={inputs.currentPrice} />
                </div>
                <CardLynch peg={m.peg} dy={inputs.dividendYield} growthRate={inputs.growthRate} />
              </div>
            )
          ) : (
            <CardCDB capitalInicial={inputs.cdiCapital} taxaCdiAnual={inputs.cdiTaxaAnual} percentualCdi={inputs.cdiRentabilidade} meses={inputs.cdiMeses} />
          )}
        </section>
      </main>
    </div>
  );
};

export default StockApp;
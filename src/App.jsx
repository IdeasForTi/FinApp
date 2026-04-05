import React, { useState, useEffect } from 'react';
import appSettings from './Data/appSettings.json';

import PainelEntrada from './components/PainelEntrada';
import CardBazin from './components/CardBazin';
import CardGraham from './components/CardGraham';
import CardLynch from './components/CardLynch';
import CardFII from './components/CardFII';
import GraficoUpside from './components/GraficoUpside';

const StockApp = () => {
  const { BaseUrl, Token } = appSettings.MarketData;
  const { BazinYieldTarget, GrahamMultiplier, DefaultGrowthRate } = appSettings.CalculationsData;
  const { Name, Version, Developer } = appSettings.ApplicationInfoData;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]); 
  const [isFiiMode, setIsFiiMode] = useState(false); // A aba selecionada é a única verdade
  
  const [inputs, setInputs] = useState({ 
    ticker: 'BBAS3',
    currentPrice: '0.00',
    dividendYield: '0.00',
    eps: '0.00',
    bvps: '0.00',
    peRatio: '0.00',
    growthRate: DefaultGrowthRate
  });

  useEffect(() => {
    const saved = localStorage.getItem('historicoAcoes_v5');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const fetchData = async () => {
    if (!inputs.ticker) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${BaseUrl}${inputs.ticker.toUpperCase()}?token=${Token}`);
      const data = await response.json();
      
      if (data.results?.[0]) {
        const stock = data.results[0];
        
        // AQUI ESTÁ A MUDANÇA: Não alteramos o isFiiMode. 
        // O usuário decide se quer tratar como Ação ou FII antes ou depois da busca.

        setInputs(prev => ({
          ...prev,
          ticker: stock.symbol,
          currentPrice: stock.regularMarketPrice?.toFixed(2) || prev.currentPrice,
          eps: stock.earningsPerShare?.toFixed(2) || prev.eps,
          peRatio: stock.priceEarnings?.toFixed(2) || prev.peRatio,
          // Mantém DY e VPA se não vierem no JSON para preenchimento manual
          bvps: stock.bookValuePerShare?.toFixed(2) || prev.bvps,
        }));
      }
    } catch (err) { setError('Erro na API'); }
    finally { setLoading(false); }
  };

  // CÁLCULOS: Dependem exclusivamente da variável isFiiMode (Aba)
  const m = (() => {
    const p = Number(inputs.currentPrice) || 0;
    const dy = Number(inputs.dividendYield) || 0;
    const lpa = Number(inputs.eps) || 0;
    const vpa = Number(inputs.bvps) || 0;

    if (isFiiMode) {
      // MODO FII: Trata o input de rendimento como VALOR EM REAIS (R$)
      const teto = (dy * 12) / 0.06;
      return { tetoBazin: teto, alvoGrafico: teto };
    } else {
      // MODO AÇÕES: Trata o input de rendimento como PORCENTAGEM (%)
      // Ideal para BRBI11, BBAS3, etc.
      const teto = (p * (dy / 100)) / 0.06;
      const graham = Math.sqrt(Math.max(0, 22.5 * lpa * vpa));
      return { tetoBazin: teto, graham, alvoGrafico: graham };
    }
  })();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans text-left">
      <header className="max-w-7xl mx-auto mb-10 border-b border-slate-900 pb-6">
        <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent italic tracking-tighter uppercase">{Name}</h1>
        <p className="text-slate-600 text-[9px] uppercase tracking-[0.2em] font-bold mt-1">{Developer} | v{Version}</p>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        <aside className="lg:col-span-4">
          <PainelEntrada 
            inputs={inputs} 
            handleChange={handleChange}
            buscarDados={fetchData}
            loading={loading}
            error={error}
            historico={history || []}
            isFiiMode={isFiiMode}
            setIsFiiMode={setIsFiiMode}
          />
        </aside>

        <div className="lg:col-span-8 space-y-6">
          {isFiiMode ? (
            <div className="flex flex-col gap-6 w-full">
              <CardFII 
                ticker={inputs.ticker} 
                precoAtual={inputs.currentPrice} 
                rendimentoMensal={inputs.dividendYield} 
                vpa={inputs.bvps} 
              />
              <GraficoUpside precoAtual={inputs.currentPrice} valorGraham={m.alvoGrafico} />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CardBazin valor={m.tetoBazin} precoAtual={inputs.currentPrice} />
                <CardGraham valor={m.graham} precoAtual={inputs.currentPrice} />
              </div>
              <GraficoUpside precoAtual={inputs.currentPrice} valorGraham={m.alvoGrafico} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StockApp;
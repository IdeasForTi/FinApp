import React, { useState, useEffect } from 'react';
import appSettings from './Data/appSettings.json';

import PainelEntrada from './components/PainelEntrada';
import CardBazin from './components/CardBazin';
import CardGraham from './components/CardGraham';
import CardLynch from './components/CardLynch';
import CardFII from './components/CardFII';
import CardCDB from './components/CardCDB';

const App = () => {
  // 1. CONFIGURAÇÕES DINÂMICAS DO JSON
  const activeApiId = appSettings.MarketData_id; 
  const apiConfig = appSettings.MarketData.find(api => api.Id === activeApiId) || appSettings.MarketData[0];
  
  const { BaseUrl, Token } = apiConfig;
  const { BazinYieldTarget, GrahamMultiplier, DefaultGrowthRate } = appSettings.CalculationsData;
  const { Name, Version, Developer } = appSettings.ApplicationInfoData;

  // 2. ESTADOS DE CONTROLE
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mainTab, setMainTab] = useState('variavel'); 
  const [isFiiMode, setIsFiiMode] = useState(false);
  
  const [historyVariavel, setHistoryVariavel] = useState([]);
  const [historyFixa, setHistoryFixa] = useState([]);

  // 3. MEMÓRIA POR CATEGORIA (Rascunhos)
  const [lastAcao, setLastAcao] = useState({ 
    ticker: 'BBAS3', currentPrice: '0.00', dividendYield: '0.00', eps: '0.00', bvps: '0.00', peRatio: '0.00', growthRate: DefaultGrowthRate 
  });
  const [lastFii, setLastFii] = useState({ 
    ticker: 'HGLG11', currentPrice: '0.00', dividendYield: '0.00', bvps: '0.00' 
  });
  const [lastFixa, setLastFixa] = useState({ 
    cdiCapital: '1000.00', cdiTaxaAnual: '10.75', cdiRentabilidade: '100', cdiMeses: '12' 
  });

  const [inputs, setInputs] = useState(lastAcao);

  // 4. EFEITOS (LIFECYCLE)
  useEffect(() => {
    const savedVariavel = localStorage.getItem('historicoVariavel_v5');
    const savedFixa = localStorage.getItem('historicoFixa_v5');
    if (savedVariavel) setHistoryVariavel(JSON.parse(savedVariavel));
    if (savedFixa) setHistoryFixa(JSON.parse(savedFixa));
  }, []);

  useEffect(() => {
    if (mainTab === 'fixa') {
      setInputs(lastFixa);
    } else {
      setInputs(isFiiMode ? lastFii : lastAcao);
    }
  }, [mainTab, isFiiMode]);

  // 5. HANDLERS
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newInputs = { ...inputs, [name]: value };
    setInputs(newInputs);

    if (mainTab === 'fixa') setLastFixa(newInputs);
    else if (isFiiMode) setLastFii(newInputs);
    else setLastAcao(newInputs);
  };

  const salvarNoHistoricoVariavel = (dados) => {
    setHistoryVariavel(prev => {
      const filtrado = (prev || []).filter(h => h.ticker !== dados.ticker);
      // Salva a flag isFii para saber como renderizar ao clicar no histórico depois
      const novo = [{ ...dados, id: Date.now(), isFii: isFiiMode }, ...filtrado].slice(0, 10);
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

  // 6. BUSCA DE DADOS (LÓGICA DE YIELD ANUALIZADO)
  const fetchData = async () => {
    if (!inputs.ticker || mainTab === 'fixa') return;
    setLoading(true);
    setError('');

    const ticker = inputs.ticker.toUpperCase();

    try {
      let novosDados = { ...inputs, ticker };

      if (activeApiId === "RAPID") {
        const tickerYahoo = ticker.endsWith('.SA') ? ticker : `${ticker}.SA`;
        const response = await fetch(
          `${BaseUrl}/market/v2/get-quotes?symbols=${tickerYahoo}&region=BR`, 
          { headers: { 'x-rapidapi-key': Token, 'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com' } }
        );
        
        if (response.status === 204) throw new Error("Ativo não encontrado");
        
        const data = await response.json();
        const result = data.quoteResponse?.result?.[0];

        if (result) {
          const preco = result.regularMarketPrice || 0;
          
          // PRIORIDADE: TrailingAnnual (12 meses acumulados)
          let rawYield = result.trailingAnnualDividendYield || result.dividendYield || 0;
          
          // TRATAMENTO: Se vier decimal (0.0357), vira percentual (3.57)
          if (rawYield > 0 && rawYield < 1) rawYield = rawYield * 100;

          novosDados = {
            ...novosDados,
            currentPrice: preco.toFixed(2),
            eps: result.epsTrailingTwelveMonths?.toFixed(2) || "0.00",
            bvps: result.bookValue?.toFixed(2) || inputs.bvps,
            peRatio: result.trailingPE?.toFixed(2) || "0.00",
            // Se FII: Converte Anual % para Mensal R$. Se Ação: Mantém Anual %
            dividendYield: isFiiMode 
              ? ((preco * (rawYield / 100)) / 12).toFixed(2) 
              : rawYield.toFixed(2)
          };
        }
      } 
      else if (activeApiId === "BRAPI") {
        const response = await fetch(`${BaseUrl}${ticker}?token=${Token}`);
        const data = await response.json();
        const stock = data.results?.[0];

        if (stock) {
          const preco = stock.regularMarketPrice || 0;
          const dyBase = stock.dividendYield || 0; // BRAPI costuma mandar o anual pronto

          novosDados = {
            ...novosDados,
            currentPrice: preco.toFixed(2),
            eps: stock.earningsPerShare?.toFixed(2),
            bvps: stock.bookValuePerShare?.toFixed(2),
            peRatio: stock.priceEarnings?.toFixed(2),
            dividendYield: isFiiMode 
              ? ((preco * (dyBase / 100)) / 12).toFixed(2)
              : dyBase.toFixed(2)
          };
        }
      }

      setInputs(novosDados);
      if (isFiiMode) setLastFii(novosDados); else setLastAcao(novosDados);
      salvarNoHistoricoVariavel(novosDados);

    } catch (err) {
      setError(`Erro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 7. CÁLCULO DE MÉTRICAS (Variável)
  const m = (() => {
    const p = Number(inputs.currentPrice) || 0;
    const dyValue = Number(inputs.dividendYield) || 0;
    const metaYield = BazinYieldTarget || 0.06;

    if (isFiiMode) {
      // Rendimento Mensal R$ * 12 meses / 0.06
      return { tetoBazin: (dyValue * 12) / metaYield };
    }
    
    // Ações: Preço * (Yield Anual % / 100) / 0.06
    return {
      tetoBazin: (p * (dyValue / 100)) / metaYield,
      graham: Math.sqrt(GrahamMultiplier * (Number(inputs.eps) || 0) * (Number(inputs.bvps) || 0)),
      peg: (Number(inputs.peRatio) || 0) / ((Number(inputs.growthRate) || 0) + dyValue)
    };
  })();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <header className="max-w-7xl mx-auto mb-6 flex justify-between items-center border-b border-slate-900 pb-6">
        <div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            {Name}
          </h1>
          <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">
            {Developer} | v{Version}
          </p>
        </div>
        <nav className="flex gap-2 bg-slate-900 p-1 rounded-xl shadow-inner">
          <button 
            onClick={() => setMainTab('variavel')} 
            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${mainTab === 'variavel' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Variável
          </button>
          <button 
            onClick={() => setMainTab('fixa')} 
            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${mainTab === 'fixa' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Fixa
          </button>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        <aside className="lg:col-span-4">
          <PainelEntrada 
            mainTab={mainTab} inputs={inputs} handleChange={handleChange} buscarDados={fetchData} loading={loading} error={error}
            isFiiMode={isFiiMode} setIsFiiMode={setIsFiiMode} historyVariavel={historyVariavel || []} historyFixa={historyFixa || []}
            setInputs={(item) => {
                // Ao clicar no histórico, ajusta o modo FII/Ação automaticamente
                if (mainTab === 'variavel' && item.isFii !== undefined) {
                  setIsFiiMode(item.isFii);
                }
                setInputs(item);
            }} 
            salvarCalculoFixa={salvarCalculoFixa}
          />
        </aside>

        <section className="lg:col-span-8 space-y-6">
          {mainTab === 'variavel' ? (
            isFiiMode ? (
              <CardFII 
                ticker={inputs.ticker} 
                precoAtual={inputs.currentPrice} 
                rendimentoMensal={inputs.dividendYield} 
                vpa={inputs.bvps} 
              />
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CardBazin valor={m.tetoBazin} precoAtual={inputs.currentPrice} dy={inputs.dividendYield} />
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

export default App;
# 📈 IdeasFor: Finance Pro v2.0

O **Value Analyzer Pro** é uma ferramenta de análise fundamentalista de ações desenvolvida para investidores que buscam decisões baseadas em dados. A aplicação utiliza as metodologias consagradas de **Benjamin Graham**, **Décio Bazin** e **Peter Lynch** para calcular o valor intrínseco e a margem de segurança de ativos da B3.

---

## ✨ Funcionalidades

* **Busca em Tempo Real:** Integração direta com a API **Brapi** para cotações e dados fundamentalistas atualizados.
* **Análise de Bazin:** Cálculo de preço teto baseado em um Dividend Yield mínimo de 6%.
* **Fórmula de Graham:** Estimativa de valor justo considerando lucro (LPA) e patrimônio (VPA).
* **PEG Ratio Ajustado (Lynch):** Avaliação de crescimento somada ao retorno por dividendos.
* **Histórico Local:** Armazenamento automático das últimas 5 pesquisas via `localStorage`.
* **Interface Responsiva:** Design "Dark Mode" premium otimizado para desktop e mobile com Tailwind CSS.
* **Tooltips Informativos:** Explicações teóricas integradas em cada métrica para facilitar o entendimento.

---

## 🛠️ Estrutura do Projeto

O projeto segue uma arquitetura modular baseada em componentes:

```text
src/
 ├── components/
 │    ├── Tooltip.jsx       # Componente de auxílio visual (balão informativo)
 │    ├── PainelEntrada.jsx # Gerenciamento de inputs, busca e histórico
 │    ├── CardBazin.jsx     # Card métrico: Estratégia de Dividendos
 │    ├── CardGraham.jsx    # Card métrico: Valor Intrínseco
 │    └── CardLynch.jsx     # Card métrico: Crescimento e PEG Ratio
 └── App.jsx               # Orquestrador de estado e lógica de cálculos
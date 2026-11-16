# 💰 Finance AI — Gestor Financeiro com Assistente de IA

Aplicação full-stack de gestão financeira pessoal desenvolvida com **Node.js**, **Fastify** e **SQLite**, equipada com gráficos dinâmicos baseados na receita, exportação para Excel e um assistente financeiro inteligente integrado à **API do Google Gemini**.

## ✨ Funcionalidades

* **Dashboard Interativo:** Visualização dinâmica de gráficos baseados na receita e distribuição de despesas por categoria (Chart.js).
* **Gestão de Transações:** Registo, listagem e controlo mensal de entradas e saídas (`Transaction.js`).
* **Assistente Financeiro com IA:** Chat integrado (`aiService.js`) com regras personalizadas para analisar os teus dados financeiros e tirar dúvidas em tempo real.
* **Exportação de Dados:** Geração de relatórios em formato Excel para controlo externo.

## 🛠️ Tecnologias Utilizadas

* **Frontend:** HTML5, CSS3, JavaScript, Chart.js (`public/index.html`)
* **Backend:** Node.js, Fastify
* **Base de Dados:** SQLite (`better-sqlite3`)
* **Inteligência Artificial:** Google Gemini API (`gemini-2.5-flash`)

## 📂 Estrutura do Projeto

```text
├── public/
│   └── index.html          # Interface principal e gráficos
├── src/
│   ├── models/
│   │   └── Transaction.js  # Modelo de dados e operações SQLite
│   └── services/
│       └── aiService.js    # Lógica de integração e regras do chat com IA
├── package.json
└── README.md
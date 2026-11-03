    # Finance AI

API de controle financeiro feita com Node.js, Fastify e SQLite.

## Tecnologias

- Node.js
- Fastify
- SQLite (better-sqlite3)

## Como rodar

```
npm install
npm run dev
```

O servidor sobe em `http://localhost:3333`.

## Rotas

| Método | Rota | O que faz |
|--------|------|-----------|
| GET | /transactions | Lista transações (filtros: `category`, `type`) |
| GET | /transactions/:id | Busca uma transação pelo ID |
| POST | /transactions | Cria uma transação |
| PUT | /transactions/:id | Atualiza uma transação |
| DELETE | /transactions/:id | Exclui uma transação |
| GET | /categories | Lista as categorias usadas |
| GET | /summary | Mostra receitas, despesas e saldo |

## Exemplo de transação

```json
{
  "description": "Salário",
  "amount": 3000,
  "type": "RECEITA",
  "category": "Trabalho",
  "date": "2026-11-03"
}
```

O campo `type` aceita apenas `RECEITA` ou `DESPESA`.
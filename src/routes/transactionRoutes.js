const Database = require("better-sqlite3");
const validateTransaction = require("../validators/transactionValidator");
const getFullTransactionAnalysis = require("../services/financialAnalysisService");
const generateFinancialAdvice = require("../services/aiService");

const db = new Database("finance.db");

// Garantir a criação da tabela caso ainda não exista no banco (Persistência)
db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    type TEXT NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL
  )
`);

async function transactionRoutes(fastify, options) {

    // GET /api/transactions
    fastify.get("/transactions", async (request, reply) => {
        const { category, type } = request.query;

        let query = "SELECT * FROM transactions WHERE 1=1";
        const params = [];

        if (category) {
            query += " AND category = ?";
            params.push(category);
        }

        if (type) {
            query += " AND type = ?";
            params.push(type);
        }

        const transactions = db.prepare(query).all(...params);

        const result = transactions.map(tx => ({
            ...tx,
            analysis: getFullTransactionAnalysis(tx)
        }));

        return result;
    });

    // POST /api/transactions
    fastify.post("/transactions", async (request, reply) => {
        const validationError = validateTransaction(request.body);

        if (validationError) {
            return reply.status(400).send({ error: validationError });
        }

        const { description, amount, type, category, date } = request.body;

        const stmt = db.prepare(`
            INSERT INTO transactions (description, amount, type, category, date)
            VALUES (?, ?, ?, ?, ?)
        `);

        const info = stmt.run(description, amount, type, category, date);

        const newTransaction = {
            id: info.lastInsertRowid,
            description,
            amount,
            type,
            category,
            date
        };

        return reply.status(201).send({
            ...newTransaction,
            analysis: getFullTransactionAnalysis(newTransaction)
        });
    });

    // GET /api/summary
    fastify.get("/summary", async (request, reply) => {
        const incomeResult = db.prepare("SELECT SUM(amount) as total FROM transactions WHERE type = 'RECEITA'").get();
        const expenseResult = db.prepare("SELECT SUM(amount) as total FROM transactions WHERE type = 'DESPESA'").get();

        const totalIncome = incomeResult.total || 0;
        const totalExpenses = expenseResult.total || 0;
        const balance = totalIncome - totalExpenses;

        return {
            income: totalIncome,
            expenses: totalExpenses,
            balance: balance
        };
    });

    // POST /api/transactions/ai-advice
    fastify.post("/transactions/ai-advice", async (request, reply) => {
        try {
            const { prompt } = request.body || {};
            const expenses = db.prepare("SELECT description, amount, type, category, date FROM transactions").all();

            const advice = await generateFinancialAdvice(expenses, prompt);
            return { advice };
        } catch (error) {
            return reply.status(500).send({ 
                error: "Falha ao gerar resposta da IA.",
                details: error.message 
            });
        }
    });

    // DELETE /api/transactions/:id
    fastify.delete("/transactions/:id", async (request, reply) => {
        const { id } = request.params;
        const stmt = db.prepare("DELETE FROM transactions WHERE id = ?");
        const result = stmt.run(id);

        if (result.changes === 0) {
            return reply.status(404).send({ error: "Transação não encontrada." });
        }

        return reply.send({ message: "Transação eliminada com sucesso." });
    });

} // <-- A chaveta de fecho da função transactionRoutes tem de ficar AQUI, no final!

module.exports = transactionRoutes;
const Transaction = require("../models/Transaction");
const validateTransaction = require("../validators/transactionValidator");
const db = require("../database/db");

// Arredonda para 2 casas decimais (evita 0.1 + 0.2 = 0.30000000000000004)
function round2(value) {
    return Math.round(value * 100) / 100;
}

async function transactionRoutes(app) {

    // GET todas as transações com filtros
    app.get("/transactions", async (request, reply) => {

        const { category, type } = request.query;

        if (type && type !== "RECEITA" && type !== "DESPESA") {
            return reply.code(400).send({
                error: "Type must be RECEITA or DESPESA"
            });
        }

        let sql = "SELECT * FROM transactions WHERE 1=1";
        const params = [];

        if (category) {
            sql += " AND category = ?";
            params.push(category);
        }

        if (type) {
            sql += " AND type = ?";
            params.push(type);
        }

        return db.prepare(sql).all(...params);
    });


    // GET categorias utilizadas (AGORA USA O BANCO)
    app.get("/categories", async () => {

        const rows = db.prepare(
            "SELECT DISTINCT category FROM transactions"
        ).all();

        return rows.map(row => row.category);
    });


    // GET uma transação pelo ID
    app.get("/transactions/:id", async (request, reply) => {

        const id = Number(request.params.id);

        const transaction = db.prepare(
            "SELECT * FROM transactions WHERE id = ?"
        ).get(id);

        if (!transaction) {
            return reply.code(404).send({
                error: "Transaction not found"
            });
        }

        return transaction;
    });


    // GET resumo financeiro (AGORA USA O BANCO)
    app.get("/summary", async () => {

        const totalReceitas = db.prepare(`
            SELECT COALESCE(SUM(amount), 0) AS total
            FROM transactions
            WHERE type = 'RECEITA'
        `).get().total;

        const totalDespesas = db.prepare(`
            SELECT COALESCE(SUM(amount), 0) AS total
            FROM transactions
            WHERE type = 'DESPESA'
        `).get().total;

        const saldo = totalReceitas - totalDespesas;

        return {
            totalReceitas: round2(totalReceitas),
            totalDespesas: round2(totalDespesas),
            saldo: round2(saldo)
        };
    });


    // POST criar uma transação
    app.post("/transactions", async (request, reply) => {

        const error = validateTransaction(request.body);

        if (error) {
            return reply.code(400).send({
                error: error
            });
        }

        const {
            description,
            amount,
            type,
            category,
            date
        } = request.body;

        const result = db.prepare(`
            INSERT INTO transactions (description, amount, type, category, date)
            VALUES (?, ?, ?, ?, ?)
        `).run(description, amount, type, category, date);

        const transaction = new Transaction(
            Number(result.lastInsertRowid),
            description,
            amount,
            type,
            category,
            date
        );

        return reply.code(201).send(transaction);
    });


    // PUT atualizar uma transação
    app.put("/transactions/:id", async (request, reply) => {

        const id = Number(request.params.id);

        const existing = db.prepare(
            "SELECT * FROM transactions WHERE id = ?"
        ).get(id);

        if (!existing) {
            return reply.code(404).send({
                error: "Transaction not found"
            });
        }

        const error = validateTransaction(request.body);

        if (error) {
            return reply.code(400).send({
                error: error
            });
        }

        const {
            description,
            amount,
            type,
            category,
            date
        } = request.body;

        db.prepare(`
            UPDATE transactions
            SET description = ?, amount = ?, type = ?, category = ?, date = ?
            WHERE id = ?
        `).run(description, amount, type, category, date, id);

        return new Transaction(id, description, amount, type, category, date);
    });


    // DELETE excluir uma transação
    app.delete("/transactions/:id", async (request, reply) => {

        const id = Number(request.params.id);

        const result = db.prepare(
            "DELETE FROM transactions WHERE id = ?"
        ).run(id);

        if (result.changes === 0) {
            return reply.code(404).send({
                error: "Transaction not found"
            });
        }

        return {
            message: "Transaction deleted successfully"
        };
    });

}

module.exports = transactionRoutes;
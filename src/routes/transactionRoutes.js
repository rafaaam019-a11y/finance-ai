const Transaction = require("../models/Transaction");
const validateTransaction = require("../validators/transactionValidator");

const transactions = [];

let nextId = 1;

async function transactionRoutes(app) {

// GET todas as transações com filtros
app.get("/transactions", async (request) => {

    const { category, type } = request.query;

    let result = transactions;

    if (category) {
        result = result.filter(
            transaction => transaction.category === category
        );
    }

   if (type) {

    if (type !== "RECEITA" && type !== "DESPESA") {
        return {
            error: "Type must be RECEITA or DESPESA"
        };
    }

    result = result.filter(
        transaction => transaction.type === type
    );

}
    return result;

});

    // GET categorias utilizadas
app.get("/categories", async () => {

    const categories = [];

    for (const transaction of transactions) {

        if (!categories.includes(transaction.category)) {
            categories.push(transaction.category);
        }

    }

    return categories;
});

    // GET uma transação pelo ID
    app.get("/transactions/:id", async (request, reply) => {

        const id = Number(request.params.id);

        const transaction = transactions.find(
            transaction => transaction.id === id
        );

        if (!transaction) {
            return reply.code(404).send({
                error: "Transaction not found"
            });
        }

        return transaction;
    });


    // GET resumo financeiro
    app.get("/summary", async () => {

        let totalReceitas = 0;
        let totalDespesas = 0;

        for (const transaction of transactions) {

            if (transaction.type === "RECEITA") {
                totalReceitas += transaction.amount;
            } else if (transaction.type === "DESPESA") {
                totalDespesas += transaction.amount;
            }
        }

        const saldo = totalReceitas - totalDespesas;

        return {
            totalReceitas,
            totalDespesas,
            saldo
        };
    });


    // POST criar uma transação
    app.post("/transactions", async (request, reply) => {

        const {
            description,
            amount,
            type,
            category,
            date
        } = request.body;

        const error = validateTransaction(request.body);

        if (error) {
            return reply.code(400).send({
                error: error
            });
        }

        const id = nextId;
        nextId++;

        const transaction = new Transaction(
            id,
            description,
            amount,
            type,
            category,
            date
        );

        transactions.push(transaction);

        return reply.code(201).send(transaction);
    });


    // PUT atualizar uma transação
    app.put("/transactions/:id", async (request, reply) => {

        const id = Number(request.params.id);

        const transaction = transactions.find(
            transaction => transaction.id === id
        );

        if (!transaction) {
            return reply.code(404).send({
                error: "Transaction not found"
            });
        }

        const {
            description,
            amount,
            type,
            category,
            date
        } = request.body;

        const error = validateTransaction(request.body);

        if (error) {
            return reply.code(400).send({
                error: error
            });
        }

        transaction.description = description;
        transaction.amount = amount;
        transaction.type = type;
        transaction.category = category;
        transaction.date = date;

        return transaction;
    });


    // DELETE excluir uma transação
    app.delete("/transactions/:id", async (request, reply) => {

        const id = Number(request.params.id);

        const index = transactions.findIndex(
            transaction => transaction.id === id
        );

        if (index === -1) {
            return reply.code(404).send({
                error: "Transaction not found"
            });
        }

        transactions.splice(index, 1);

        return {
            message: "Transaction deleted successfully"
        };
    });

}

module.exports = transactionRoutes;
    const Transaction = require("../models/Transaction");

    const transactions = [];

    async function transactionRoutes(app) {

        app.get("/transactions", async () => {

            return transactions; 

        });

        app.post("/transactions", async (request, reply) => {

            const {
                description,
                amount,
                type,
                category,
                date
            } = request.body;

            const transaction = new Transaction(
                description,
                amount,
                type,
                category,
                date
            );

            transactions.push(transaction);

            return reply.status(201).send(transaction);

        });

    }

    module.exports = transactionRoutes;
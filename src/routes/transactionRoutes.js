const Transaction = require("../models/Transaction");
const calculateImportance = require("../services/importanceService");
const calculateImpact = require("../services/impactService");
const analyzeTransaction = require("../services/analysisService");

const transactions = [];

async function transactionRoutes(app) {
  app.get("/transactions", async () => {
    return transactions;
  });

  app.post("/transactions", async (request, reply) => {
    const { description, amount, type, category, date } = request.body;

    if (amount <= 0) {
      return reply.status(400).send({
        error: "O valor deve ser maior que zero",
      });
    }

    if (type !== "RECEITA" && type !== "DESPESA") {
      return reply.status(400).send({
        error: "O tipo deve ser RECEITA ou DESPESA",
      });
    }

    if (!description || description.trim() === "") {
      return reply.status(400).send({
        error: "A descrição é obrigatória",
      });
    }

    if (!date || isNaN(Date.parse(date))) {
      return reply.status(400).send({
        error: "A data é inválida",
      });
    }

    if (!category || category.trim() === "") {
      return reply.status(400).send({
        error: "A categoria é obrigatória",
      });
    }

    const transaction = new Transaction(
      description,
      amount,
      type,
      category,
      date,
    );

    transaction.importance = calculateImportance(transaction);
    transaction.impact = calculateImpact(transaction);
    transaction.analysis = analyzeTransaction(transaction);

    transactions.push(transaction);

    return reply.status(201).send(transaction);
  });
}

module.exports = transactionRoutes;

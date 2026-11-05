// CORREÇÃO: Usar './' em vez de '../'
const calculateImpact = require("./impactService");
const calculateImportance = require("./importanceService");
const analyzeTransaction = require("./analysisService");

function getFullTransactionAnalysis(transaction) {
    if (transaction.type !== "DESPESA") {
        return null;
    }

    const impact = calculateImpact(transaction);
    const importance = calculateImportance(transaction);
    
    const status = analyzeTransaction({
        ...transaction,
        impact,
        importance
    });

    return {
        impact,
        importance,
        status
    };
}

module.exports = getFullTransactionAnalysis;
function calculateImpact(transaction) {
    if (transaction.amount <= 100) {
        return "BAIXO";
    }

if (transaction.amount <= 500) {
    return "MÉDIO";

}

return "ALTO";

}

module.exports = calculateImpact;

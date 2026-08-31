function calculateImportance(transaction) {

    if (
        transaction.category === "Moradia" ||
        transaction.category === "Saúde"
    ) {
        return "ALTA";
    }

    if (
        transaction.category === "Alimentação" &&
        transaction.amount >= 500
    ) {
        return "ALTA";
    }

    if (
        transaction.category === "Alimentação" ||
        transaction.category === "Transporte"
    ) {
        return "MÉDIA";
    }

    if (
        transaction.category === "Lazer" &&
        transaction.amount >= 300
    ) {
        return "MÉDIA";
    }

    if (transaction.category === "Lazer") {
        return "BAIXA";
    }

    return "MÉDIA";
}

module.exports = calculateImportance;
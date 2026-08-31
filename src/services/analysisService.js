function analyzeTransaction(transaction) {
    if (
        transaction.importance === "ALTA" &&
        transaction.impact === "ALTA") {
            return "GASTO CRÍTICO";
        }

        if (
            transaction.importance === "ALTA" &&
            transaction.impact === "MÉDIA") {
                return "GASTO IMPORTANTE";
            }

            if (
                transaction.importance === "BAIXA" &&
                transaction.impact === "ALTO") {
                   return "GASTO PARA REVISAR";
                }

                if(
                    transaction.importance ==="BAIXA" &&
                    transaction.impact === "BAIXO") {
                        return "GASTO NÃO ESSENCIAL";
                    }

                    return "GASTO MODERADO";

                }

                module.exports = analyzeTransaction;


        
    
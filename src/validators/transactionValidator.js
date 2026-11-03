function validateTransaction(data) {

    if (!data) {
        return "Transaction data is required";
    }

    const {
        description,
        amount,
        type,
        category,
        date
    } = data;

    // CORREÇÃO: agora checa se é texto antes de usar o .trim()
    if (typeof description !== "string" || description.trim() === "") {
        return "Description is required";
    }

    if (typeof amount !== "number" || amount <= 0) {
        return "Amount must be greater than zero";
    }

    if (type !== "RECEITA" && type !== "DESPESA") {
        return "Type must be RECEITA or DESPESA";
    }

    // CORREÇÃO: mesma checagem de tipo para category
    if (typeof category !== "string" || category.trim() === "") {
        return "Category is required";
    }

    // CORREÇÃO: mesma checagem de tipo para date
    if (typeof date !== "string" || date.trim() === "") {
        return "Date is required";
    }

    if (isNaN(Date.parse(date))) {
        return "Invalid date";
    }

    return null;
}

module.exports = validateTransaction;
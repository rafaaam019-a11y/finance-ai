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
    
    if (!description || description.trim() === "") {
        return "Description is required";
    }

    if (typeof amount !== "number" || amount <= 0) {    
        return "Amount must be greater than zero";
    }

    if (type !== "RECEITA" && type !== "DESPESA") {
        return "Type must be RECEITA or DESPESA";
    }

    if (!category || category.trim() === "") {
        return "Category is required";
    }

    if (!date || date.trim() === "") {
        return "Date is required";
    }

    if (isNaN(Date.parse(date))) {
        return "Invalid date";
    }

    return null;
}

module.exports = validateTransaction;

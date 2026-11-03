class Transaction {
    constructor(description, amount, type, category, date) {
        this.description = description;
        this.amount = amount;
        this.type = type;
        this.category = category;
        this.date = date;

        this.importance = null;
        this.impact = null;

    }
}

module.exports = Transaction;
const Database = require("better-sqlite3");

// Abre (ou cria) o arquivo do banco de dados
const db = new Database("finance.db");

// Cria a tabela só se ela ainda não existir
db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL
    )
`);

module.exports = db;
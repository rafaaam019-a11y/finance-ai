const fastify = require ("fastify");

const app = fastify({
    logger: true
});

const transactionRoutes = require("./routes/transactionRoutes");

app.get("/", async () =>{
    return{
        message: "FinanceAI API funcionando!"
    };
});

app.register(transactionRoutes);

app.listen ({
    port: 3333
}).then(() => {
    console.log("Servidor rodando na porta 3333")
});
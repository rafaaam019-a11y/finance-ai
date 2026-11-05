require("dotenv").config();
const fastify = require("fastify")({ logger: true });
const path = require("path");

// Log para confirmar que a chave foi lida ao iniciar o servidor
if (process.env.GEMINI_API_KEY) {
    console.log("🔑 Chave GEMINI_API_KEY carregada com sucesso!");
} else {
    console.log("⚠️ AVISO: GEMINI_API_KEY não foi encontrada no ficheiro .env");
}

// 1. Registar o CORS
fastify.register(require("@fastify/cors"), { origin: "*" });

// 2. Registar as rotas da API sob o prefixo /api
const transactionRoutes = require("./routes/transactionRoutes");
fastify.register(transactionRoutes, { prefix: "/api" });

// 3. Servir a pasta public (Interface Gráfica)
fastify.register(require("@fastify/static"), {
    root: path.join(__dirname, "..", "public"),
    prefix: "/"
});

const PORT = process.env.PORT || 3333;

fastify.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server running on port ${PORT}`);
});
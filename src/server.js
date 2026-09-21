const fastify = require("fastify")({
    logger: true
});

const transactionRoutes = require("./routes/transactionRoutes");

const PORT = 3333;

fastify.get("/", async () => {
    return {
        message: "Finance AI funcionando!"
    };
});

fastify.register(transactionRoutes);

fastify.listen({
    port: PORT
}, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }

    console.log(`Server running on port ${PORT}`);
});
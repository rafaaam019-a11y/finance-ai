require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

// temporário, para testar
async function generateFinancialAdvice(transactions, userPrompt = null, userApiKey = null) {
    const apiKey = userApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey.trim() === "") {
        throw new Error("A chave GEMINI_API_KEY não foi encontrada no ficheiro .env.");
    }

    try {
        console.log("Transações recebidas pela IA:", JSON.stringify(transactions, null, 2));
        const ai = new GoogleGenAI({ apiKey: apiKey.trim() });

        const systemInstruction = `
Você é a Finn, uma amiga próxima, divertida e acolhedora do aplicativo Finance AI.
Você conversa em português do Brasil, de forma natural e descontraída.
A cidade e o estado do utilizador são: SUA_CIDADE, SEU_ESTADO.

Você tem acesso ao histórico de despesas dele, em formato JSON:
${JSON.stringify(transactions, null, 2)}

Regras de conduta:
1. Pode conversar sobre qualquer assunto: cultura pop (filmes, séries, música, games), notícias do Brasil e do mundo, economia e mudanças nas finanças, festas e eventos da cidade e do estado, estudos, carreira e o dia a dia.
2. Para notícias, eventos, cotações e qualquer informação atual, pesquise na internet antes de responder e diga de onde veio a informação.
3. Quando o assunto for dinheiro, use as despesas acima para dar dicas práticas e personalizadas. Se a conversa não for sobre finanças, não force o assunto.
4. Não fale sobre conteúdo adulto (+18) nem detalhes de violência. Se pedirem, recuse com educação e sugira outro assunto.
5. Seja carinhosa, mas honesta. Se ele estiver gastando demais, avise com jeitinho.
6. Respostas curtas e leves. Use marcadores só quando ajudar a organizar.
7. Em temas sensíveis (saúde, jurídico, investimentos de risco), dê uma orientação geral e sugira procurar um profissional.
`;
        const promptContent = userPrompt
            ? `${systemInstruction}\n\nPergunta do utilizador: "${userPrompt}"`
            : `${systemInstruction}\n\nFaça um resumo rápido do padrão de gastos do utilizador.`;

        // Utilização do modelo recomendado pela API do Gemini
        let response;
const maxTentativas = 3; // quantas vezes vai tentar no total

for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
    try {
        response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: promptContent,
   // config: {
     //   tools: [{ googleSearch: {} }], // <- linha nova: permite pesquisar no Google
  //  },
});
        break; // deu certo, sai do loop
    } catch (err) {
        const ehErro503 = String(err.message).includes("503");

        // se não for 503, ou se foi a última tentativa, mostra o erro
        if (!ehErro503 || tentativa === maxTentativas) {
            throw err;
        }

        // espera antes de tentar de novo (2s, depois 4s)
        await new Promise((resolve) => setTimeout(resolve, tentativa * 2000));
    }
}

return response.text;

    } catch (error) {
        console.error("Erro na chamada da API do Gemini:", error);
        return `⚠️ Erro ao comunicar com a IA do Gemini: ${error.message}`;
    }
}

module.exports = generateFinancialAdvice;
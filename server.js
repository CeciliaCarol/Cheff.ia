require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Replicate = require("replicate");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY;

console.log("Chave da API Replicate:", REPLICATE_API_KEY);

// Instancia o cliente Replicate com a chave de API
const replicateClient = new Replicate({
  auth: REPLICATE_API_KEY,
});

// Função para gerar resposta do modelo Meta LLaMA 3-8b-Instruct
async function gerarReceita(ingredientes) {
  try {
    console.log("Ingredientes recebidos:", ingredientes);

    // Formata os ingredientes como uma string e cria um prompt claro
    const inputText = `Crie uma receita detalhada utilizando os seguintes ingredientes: ${ingredientes.join(", ")}.  
      Formate a resposta de maneira simples e bem estruturada, sem usar asteriscos, negrito ou caracteres especiais.  

      Use este formato:  

      Título: Nome da Receita  
      Ingredientes:  
      - Ingrediente 1  
      - Ingrediente 2  

      Modo de Preparo:  
      1. Passo 1  
      2. Passo 2  

      Não use formatação Markdown ou caracteres especiais. Apenas texto simples e claro.`;

    // Solicitação ao modelo Meta LLaMA 3-8b-Instruct via Replicate
    const modelResponse = await replicateClient.run(
      "meta/meta-llama-3-8b-instruct", // Nome do modelo no Replicate
      {
        input: {
          prompt: inputText, // Passando os ingredientes como prompt
          max_length: 500, // Ajuste conforme necessário
          temperature: 0.7, // Ajuste conforme necessário
        },
      }
    );

    console.log("Resposta da API Replicate:", modelResponse);

    // Processamento da resposta para formatar como um objeto de receita
    const receitas = [{
      titulo: "Receita Gerada",
      descricao: modelResponse, // Ajuste conforme o formato da resposta
      ingredientes: ingredientes,
      instrucoes: modelResponse, // Ajuste conforme o formato da resposta
    }];

    return receitas;
  } catch (erro) {
    console.error("Erro ao acessar o modelo Replicate:", erro);
    return { erro: "Erro ao gerar a receita. Por favor, tente novamente." };
  }
}

app.post("/gerar-receita", async (req, res) => {
  const { ingredientes } = req.body;

  if (!ingredientes || !Array.isArray(ingredientes)) {
    return res.status(400).json({ erro: "O corpo da requisição deve conter um array 'ingredientes'" });
  }

  const receitas = await gerarReceita(ingredientes);
  res.json({ receitas });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://0.0.0.0:${port}`);
});
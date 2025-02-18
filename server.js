require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = "tasty.p.rapidapi.com";

console.log("Chave da API:", RAPIDAPI_KEY); // Log para debug

async function gerarReceita(ingredientes) {
  try {
    console.log("Ingredientes recebidos:", ingredientes); // Log para debug
    const response = await axios.get(
      "https://tasty.p.rapidapi.com/recipes/list",
      {
        params: { q: ingredientes.join(", "), from: "0", size: "5" },
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": RAPIDAPI_HOST,
        },
      }
    );
    console.log("Resposta da API Tasty:", response.data); // Log para debug
    if (response.data && response.data.results) {
      const receitas = response.data.results.map((item) => ({
        titulo: item.name,
        descricao: item.description || "Sem descrição disponível.",
        ingredientes: item.sections?.[0]?.components.map((c) => c.raw_text) || [],
        instrucoes: item.instructions?.map((inst) => inst.display_text) || [],
      }));
      return receitas;
    }
    return [];
  } catch (erro) {
    console.error("Erro ao acessar a API:", erro.response ? erro.response.data : erro.message);
    return [];
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

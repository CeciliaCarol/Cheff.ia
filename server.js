require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const HF_API_KEY = process.env.HF_API_KEY;
const HF_MODEL = "HuggingFaceH4/zephyr-7b-beta"; // Modelo escolhido

async function gerarReceita(ingredientes) {
  const prompt = `Com os seguintes ingredientes, crie uma receita simples e passo a passo: ${ingredientes.join(", ")}.`;

  try {
    const resposta = await axios.post(
      `https://api-inference.huggingface.co/models/${HF_MODEL}`,
      { inputs: prompt },
      { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
    );

    console.log("🍽️ Receita sugerida:");
    console.log(resposta.data[0].generated_text);
    return resposta.data[0].generated_text;
  } catch (erro) {
    console.error("Erro ao acessar a API:", erro.response ? erro.response.data : erro.message);
    return null;
  }
}

app.post("/gerar-receita", async (req, res) => {
  const { ingredientes } = req.body;

  if (!ingredientes || !Array.isArray(ingredientes)) {
    return res.status(400).json({ erro: "O corpo da requisição deve conter um array 'ingredientes'" });
  }

  const receita = await gerarReceita(ingredientes);
  if (receita) {
    res.json({ receita });
  } else {
    res.status(500).json({ erro: "Erro ao gerar receita." });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
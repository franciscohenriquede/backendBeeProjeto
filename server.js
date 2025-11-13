import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config"; // carrega o .env

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Conexão com o MongoDB Atlas
await mongoose.connect(process.env.MONGO_URI);
console.log("✅ Conectado ao MongoDB Atlas!");

// 🔹 Modelo da mensagem
const mensagemSchema = new mongoose.Schema({
  texto: String,
  data: { type: Date, default: Date.now },
});

const Mensagem = mongoose.model("Mensagem", mensagemSchema);

// 🔹 Rota para receber e salvar mensagem
app.post("/mensagens", async (req, res) => {
  try {
    const novaMensagem = new Mensagem({ texto: req.body.texto });
    await novaMensagem.save();
    res.status(201).json({ message: "Mensagem salva!" });
  } catch (error) {
    console.error("Erro ao salvar mensagem:", error);
    res.status(500).json({ error: "Erro ao salvar mensagem" });
  }
});

// 🔹 Rota para listar mensagens
app.get("/mensagens", async (req, res) => {
  try {
    const mensagens = await Mensagem.find().sort({ data: -1 });
    res.json(mensagens);
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    res.status(500).json({ error: "Erro ao buscar mensagens" });
  }
});

// 🔹 Porta
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

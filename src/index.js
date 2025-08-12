import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();

// raw body só para o webhook
app.use('/api/mp/webhook', express.raw({ type: '*/*' }));

// json normal para o resto
app.use(express.json());
app.use(cors());

// rotas
import mpRoutes from './routes/mp.routes.js';
app.use('/api/mp', mpRoutes);

app.get('/health', (_req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
});

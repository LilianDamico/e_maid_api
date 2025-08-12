import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';

// Rotas que você já tem
import mpRoutes from './routes/mp.routes.js';
// *** REMOVIDO *** // import accountRoutes from './routes/account.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

// Mercado Pago
app.use('/api/mp', mpRoutes);

// *** REMOVIDO *** // app.use('/api/account', accountRoutes);

app.get('/', (_req, res) => {
  res.json({ ok: true, name: 'e_maid_api', version: '1.0.0' });
});

const PORT = process.env.PORT ?? 8080;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

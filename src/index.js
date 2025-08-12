// src/index.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import mpRoutes from './routes/mp.routes.js';
import accountRoutes from './routes/account.routes.js';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// rate limit simples
app.use('/api/', rateLimit({ windowMs: 60_000, max: 60 }));

app.use('/api', mpRoutes);
app.use('/api', accountRoutes);

// healthcheck
app.get('/', (_, res) => res.send('E-Maid API OK'));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

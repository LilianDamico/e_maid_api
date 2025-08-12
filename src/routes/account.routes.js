// src/routes/account.routes.js
import { Router } from 'express';
import { deleteAccount } from '../controllers/account.controller.js';

const router = Router();

// Exclusão via API
router.delete('/account', deleteAccount);

// Página pública com instruções (para o Play Console)
router.get('/account/delete', (req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Excluir minha conta - E-Maid</title>
<style>
body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:720px;margin:40px auto;padding:0 16px;line-height:1.6}
h1{color:#0f766e} code{background:#f4f4f5;padding:2px 6px;border-radius:6px}
.btn{display:inline-block;background:#0f766e;color:#fff;padding:10px 14px;border-radius:8px;text-decoration:none}
.card{background:#f8fafc;border:1px solid #e5e7eb;border-radius:10px;padding:16px}
small{color:#6b7280}
</style>
</head>
<body>
  <h1>Excluir minha conta</h1>
  <p>Você pode excluir sua conta diretamente pelo app E-Maid em <b>Perfil → Configurações → Excluir minha conta</b>. A exclusão é permanente e remove seu cadastro e dados pessoais (Auth + Firestore).</p>

  <div class="card">
    <h3>Prefere solicitar pela Web?</h3>
    <p>Se você não tem mais acesso ao app, envie um e-mail para <a href="mailto:suporte@e-maid.app">suporte@e-maid.app</a> com o assunto <b>Excluir conta</b> e o e-mail cadastrado. Concluiremos a exclusão em até 7 dias.</p>
    <p><small>Para exclusão imediata, use o app (recomendado).</small></p>
  </div>

  <p><a class="btn" href="https://e-maid.app" target="_blank" rel="noopener">Abrir site do E-Maid</a></p>

  <hr />
  <small>Última atualização: ${new Date().toISOString().slice(0,10)}</small>
</body>
</html>`);
});

export default router;

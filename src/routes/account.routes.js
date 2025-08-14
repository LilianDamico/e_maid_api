import { Router } from 'express';
const router = Router();

// GET /account/delete  → página informativa (requisito do Google Play)
router.get('/account/delete', (_req, res) => {
  res.type('html').send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Excluir conta – e-Maid</title>
  <style>
    body { font-family: system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,'Helvetica Neue',Arial;
           max-width: 840px; margin: 40px auto; padding: 0 16px; line-height: 1.55; color:#1f2937; }
    h1 { font-size: 26px; margin: 0 0 10px; }
    .card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 18px; margin: 18px 0; }
    .muted { color:#6b7280; font-size: 14px; }
    ul { margin: 8px 0 0 18px; }
    a { color:#0ea5e9; }
  </style>
</head>
<body>
  <h1>Exclusão de conta</h1>
  <p>Esta página explica como excluir definitivamente sua conta e dados do e-Maid, conforme a nossa
     <a href="https://emaid.app/politica" target="_blank" rel="noopener">Política de Privacidade</a>.</p>

  <div class="card">
    <h2>Opção 1 — Pelo aplicativo (recomendado)</h2>
    <p>No app, acesse:</p>
    <ul>
      <li><strong>Perfil</strong> → <strong>Configurações</strong> → <strong>Excluir conta</strong></li>
    </ul>
    <p class="muted">A ação remove sua conta do Firebase Auth e dados relacionados no Firestore. O processo é irreversível.</p>
  </div>

  <div class="card">
    <h2>Opção 2 — Solicitar por e-mail</h2>
    <p>Envie um e-mail para <a href="mailto:suporte@emaid.app?subject=Exclus%C3%A3o%20de%20conta%20-%20eMaid">suporte@emaid.app</a>
       a partir do mesmo e-mail cadastrado, informando:</p>
    <ul>
      <li>Nome completo</li>
      <li>E-mail da conta</li>
      <li>Texto: “Solicito a exclusão definitiva da minha conta e dados.”</li>
    </ul>
    <p class="muted">Responderemos e concluiremos a exclusão em até 30 dias corridos.</p>
  </div>

  <p class="muted">Se você não consegue acessar o app, utilize a opção por e-mail.</p>
</body>
</html>`);
});

export default router;

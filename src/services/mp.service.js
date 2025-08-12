import mercadopago from 'mercadopago';
import fetch from 'node-fetch';

const {
  MP_CLIENT_ID,
  MP_CLIENT_SECRET,
  MP_REDIRECT_URI,
  MP_PLATFORM_ACCESS_TOKEN
} = process.env;

// Inicialização “default” (útil pra algumas chamadas administrativas)
if (MP_PLATFORM_ACCESS_TOKEN) {
  mercadopago.configure({ access_token: MP_PLATFORM_ACCESS_TOKEN });
}

// === OAUTH ===
// Gera URL de autorização para o profissional conectar a própria conta ao seu app
export function buildOAuthUrl({ professionalId, state }) {
  const params = new URLSearchParams({
    client_id: MP_CLIENT_ID,
    response_type: 'code',
    platform_id: 'mp', // opcional
    redirect_uri: MP_REDIRECT_URI,
    state: state || professionalId // anexamos o professionalId no state
  });
  return `https://auth.mercadopago.com/authorization?${params.toString()}`;
}

// Troca code por tokens do profissional
export async function exchangeCodeForTokens(authorizationCode) {
  const url = 'https://api.mercadopago.com/oauth/token';
  const body = {
    grant_type: 'authorization_code',
    client_id: MP_CLIENT_ID,
    client_secret: MP_CLIENT_SECRET,
    code: authorizationCode,
    redirect_uri: MP_REDIRECT_URI
  };

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', accept: 'application/json' },
    body: JSON.stringify(body)
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Falha no OAuth: ${resp.status} - ${err}`);
  }

  return await resp.json(); // retorna access_token do PROFESSIONAL
}

// === CHECKOUT PRO (preferência com comissão) ===
// Cria a preferência de pagamento com 8% de comissão. 
// ATENÇÃO: para Marketplace, o recomendado é criar a preferência usando o access_token do VENDEDOR (profissional).
export async function createCheckoutPreferenceWithFee({
  sellerAccessToken,
  title,
  amount,
  quantity = 1,
  externalReference,
  payerEmail,
  successUrl = 'https://emaid.app/pagamento/sucesso',
  failureUrl = 'https://emaid.app/pagamento/erro',
  pendingUrl = 'https://emaid.app/pagamento/pendente',
  commissionPercent = 0.08
}) {
  const feeValue = Number((amount * commissionPercent).toFixed(2));

  const client = new mercadopago.MercadoPagoConfig({
    accessToken: sellerAccessToken, // <- access token do PROFISSIONAL
    options: { timeout: 10000 }
  });
  const preference = new mercadopago.Preference(client);

  const body = {
    items: [
      {
        title,
        quantity,
        currency_id: 'BRL',
        unit_price: Number(amount)
      }
    ],
    payer: payerEmail ? { email: payerEmail } : undefined,
    back_urls: {
      success: successUrl,
      failure: failureUrl,
      pending: pendingUrl
    },
    auto_return: 'approved',
    external_reference: externalReference,

    // *** a mágica da comissão: ***
    marketplace_fee: feeValue // para Checkout Pro (preferências)
  };

  const result = await preference.create({ body });
  return result;
}

// === STATUS DO PAGAMENTO ===
export async function getPaymentById({ accessToken, paymentId }) {
  const url = `https://api.mercadopago.com/v1/payments/${paymentId}`;
  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Erro ao consultar pagamento: ${resp.status} - ${err}`);
  }
  return await resp.json();
}

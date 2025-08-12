// src/controllers/mp.controller.js
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN, // defina no .env
});

// Healthcheck
export const health = (req, res) => res.json({ ok: true });

// PIX
export const createPixPayment = async (req, res) => {
  try {
    const { amount, description, userEmail, externalReference } = req.body;

    const payment = new Payment(mp);
    const resp = await payment.create({
      body: {
        transaction_amount: Number(amount),
        description,
        payment_method_id: 'pix',
        payer: { email: userEmail },
        external_reference: externalReference, // bookingId etc.
        // optional: notification_url: 'https://sua-api/webhook/mercadopago'
      },
    });

    return res.status(201).json(resp);
  } catch (err) {
    console.error('PIX error:', err);
    return res.status(500).json({ error: 'Erro ao criar pagamento PIX', details: err.message });
  }
};

// Checkout (cartão/boleto) - Preference
export const createPreference = async (req, res) => {
  try {
    const { title, amount, userEmail, externalReference } = req.body;

    const preference = new Preference(mp);
    const resp = await preference.create({
      body: {
        items: [
          { title, quantity: 1, currency_id: 'BRL', unit_price: Number(amount) },
        ],
        payer: { email: userEmail },
        external_reference: externalReference,
        back_urls: {
          success: 'https://seu-dominio/sucesso',
          failure: 'https://seu-dominio/falha',
          pending: 'https://seu-dominio/pendente',
        },
        auto_return: 'approved',
        // optional: notification_url: 'https://sua-api/webhook/mercadopago'
      },
    });

    return res.status(201).json(resp);
  } catch (err) {
    console.error('Preference error:', err);
    return res.status(500).json({ error: 'Erro ao criar preference', details: err.message });
  }
};

// Webhook (simples por enquanto; ajuste depois com verificação de assinatura)
export const webhook = async (req, res) => {
  try {
    console.log('Webhook headers:', req.headers);
    console.log('Webhook body:', req.body); // lembre de usar express.raw para essa rota
    // TODO: consultar /v1/payments/:id quando type/action forem de pagamento
    return res.sendStatus(200);
  } catch (err) {
    console.error('Webhook error:', err);
    return res.sendStatus(500);
  }
};

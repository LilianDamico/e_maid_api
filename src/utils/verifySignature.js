import crypto from 'crypto';

export function verifySignature(req) {
  const signature = req.headers['x-signature-id'];
  const secret = process.env.WEBHOOK_SECRET;

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  return signature === expectedSignature;
}

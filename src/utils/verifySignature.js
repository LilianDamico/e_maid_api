import crypto from 'node:crypto';

export function verifySignature(rawBody, signature, secret) {
  if (!secret) return false;
  try {
    const hmac = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(signature));
  } catch {
    return false;
  }
}

import { Router } from 'express';
import { health, createPixPayment, createPreference, webhook } from '../controllers/mp.controller.js';

const router = Router();

router.get('/health', health);
router.post('/payments/pix', createPixPayment);
router.post('/payments/preference', createPreference);
router.post('/webhook/mercadopago', webhook);

export default router;

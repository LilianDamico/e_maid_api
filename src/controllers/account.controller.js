// src/controllers/account.controller.js
import admin from '../firebase/admin.js';
import { FieldPath } from 'firebase-admin/firestore';

const db = admin.firestore();

/**
 * Apaga todos os docs de uma coleção onde um campo == valor.
 */
async function deleteCollectionByField(collection, field, value) {
  const snap = await db.collection(collection).where(field, '==', value).get();
  if (snap.empty) return;
  const batch = db.batch();
  snap.forEach((d) => batch.delete(d.ref));
  await batch.commit();
}

/**
 * DELETE /api/account
 * Header: Authorization: Bearer <Firebase ID Token>
 */
export async function deleteAccount(req, res) {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing token' });

    // valida token e pega uid
    const decoded = await admin.auth().verifyIdToken(token);
    const uid = decoded.uid;

    // 1) apaga Firestore (users, professionals, bookings, reviews, notifications)
    await Promise.all([
      db.collection('users').doc(uid).delete().catch(() => {}),
      db.collection('professionals').doc(uid).delete().catch(() => {}),
      deleteCollectionByField('bookings', 'clientId', uid),
      deleteCollectionByField('bookings', 'professionalId', uid),
      deleteCollectionByField('reviews', 'clientId', uid),
      deleteCollectionByField('notifications', 'userId', uid),
    ]);

    // 2) apaga o usuário no Auth
    await admin.auth().deleteUser(uid);

    return res.json({ ok: true, message: 'Conta excluída com sucesso.' });
  } catch (err) {
    console.error('deleteAccount error', err);
    return res.status(500).json({ error: 'Falha ao excluir conta.' });
  }
}

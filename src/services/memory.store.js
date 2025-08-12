// Mapa: professionalId -> { mp_user_id, access_token, refresh_token, public_key, live_mode, expires_in, scope, token_type, ... }
const store = new Map();

export function saveProfessionalOAuth(professionalId, payload) {
  store.set(professionalId, { ...payload, connected_at: Date.now() });
}

export function getProfessionalOAuth(professionalId) {
  return store.get(professionalId) || null;
}

export function allConnections() {
  return Array.from(store.entries()).map(([k, v]) => ({ professionalId: k, ...v }));
}

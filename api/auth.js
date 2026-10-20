const crypto = require('crypto');
const { makeToken, isAdmin } = require('./_lib');
const h = (s) => crypto.createHash('sha256').update(String(s)).digest();

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const a = req.query.a;
  if (a === 'me') return res.status(200).json({ admin: isAdmin(req) });
  if (a === 'logout') {
    res.setHeader('Set-Cookie', 'adm=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0');
    return res.status(200).json({ ok: true });
  }
  if (a === 'login' && req.method === 'POST') {
    const pw = process.env.ADMIN_PASSWORD;
    if (!pw || !process.env.SESSION_SECRET) return res.status(500).json({ error: 'config' });
    const ok = crypto.timingSafeEqual(h((req.body && req.body.password) || ''), h(pw));
    if (!ok) { await new Promise((r) => setTimeout(r, 800)); return res.status(401).json({ error: 'senha' }); }
    res.setHeader('Set-Cookie', 'adm=' + makeToken() + '; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800');
    return res.status(200).json({ ok: true });
  }
  res.status(400).json({ error: 'bad request' });
};

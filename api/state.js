const { KEY, redis, isAdmin } = require('./_lib');
const str = (v, n) => typeof v === 'string' && v.length <= n;
const sc = (r) => r === null || (Number.isFinite(r) && r >= 0 && r < 1000);

function valid(d) {
  if (!d || typeof d !== 'object' || !Array.isArray(d.teams) || d.teams.length > 32) return false;
  if (!d.res || typeof d.res !== 'object' || !d.ko || typeof d.ko !== 'object') return false;
  const ids = new Set();
  for (const t of d.teams) {
    if (!t || !str(t.id, 40) || !str(t.n, 60) || !Array.isArray(t.p) || t.p.length > 20 || ids.has(t.id)) return false;
    ids.add(t.id);
    for (const p of t.p) if (!p || !str(p.k, 40) || typeof p.c !== 'boolean') return false;
  }
  for (const k in d.res) {
    const r = d.res[k];
    if (!Array.isArray(r) || r.length !== 4 || !r.every(sc) || r[0] > 2 || r[1] > 2) return false;
  }
  for (const k in d.ko) {
    const r = d.ko[k];
    if (!Array.isArray(r) || r.length !== 2 || !sc(r[0]) || !sc(r[1])) return false;
  }
  return true;
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (req.method === 'GET') {
      const v = await redis(['GET', KEY]);
      if (!v) return res.status(404).json({});
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).send(v);
    }
    if (req.method === 'PUT') {
      if (!isAdmin(req)) return res.status(401).json({ error: 'login' });
      const d = req.body;
      if (!valid(d)) return res.status(400).json({ error: 'dados invalidos' });
      const clean = { teams: d.teams.map((t) => ({ id: t.id, n: t.n, p: t.p.map((p) => ({ k: p.k, c: p.c })) })), res: d.res, ko: d.ko };
      await redis(['SET', KEY, JSON.stringify(clean)]);
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'method' });
  } catch (e) {
    res.status(500).json({ error: 'servidor' });
  }
};
